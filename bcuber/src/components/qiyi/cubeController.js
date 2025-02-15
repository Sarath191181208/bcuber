//@ts-check
import { CubeCrypto } from "./cubeEncodeDecodeHandler.js";
import { drawFacelet } from "./simple2dRender.js";
import { CubeParser } from "./cubeMessageParser.js";

export class QiYiCubeController {
    // cube player is an interface having addMoves method
    /**
     * @param {{ SERVICE_UUID: any; CHARACTERISTIC_UUID: any; MAC_ADDRESS: any; KEYS: any; }} config
     * @param {(arg0: {inputs: {cubeTimeStamp: number, move: string}[], facelet: string}) => void } notifyMoves
     * @param {HTMLElement | undefined} renderIn
     */
    constructor(config, notifyMoves, renderIn) {
        this.config = config;
        this.lastTs = 0;
        this.batteryLevel = 0;
        this.prevMoves = []; // Stores moves for playback
        this.currentIndex = 0;
        this.isPlaying = false;
        this.renderContainer = renderIn;
        this.notifyMoves = notifyMoves;

    }

    async connectCube() {
        try {
            const device = await this.requestBluetoothDevice();
            console.log("Device:", device);

            if (!device || !device.gatt) {
                throw new Error("Could not connect to QiYi Cube. Make sure the cube is nearby and advertising.");
            }

            const server = await device.gatt.connect();
            const { cubeService, cubeCharacteristic } = await this.discoverCubeServiceAndCharacteristic(server);

            this.setupDataListener(cubeCharacteristic);
            await cubeCharacteristic.startNotifications();
            console.log("QiYi Cube connected and listening for data!");

            // Send initial hello message (including MAC address)
            await this.sendHello(cubeCharacteristic, this.config.MAC_ADDRESS);
        } catch (error) {
            console.error("Error connecting to QiYi Cube:", error);
        }
    }

    async requestBluetoothDevice() {
        // @ts-ignore
        if (!navigator.bluetooth) {
            throw new Error("Web Bluetooth API is not available in this browser.");
        }
        // @ts-ignore
        return navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [this.config.SERVICE_UUID]
        });
    }

    /**
       * @param {{ getPrimaryService: (arg0: any) => any; }} server
       */
    async discoverCubeServiceAndCharacteristic(server) {
        try {
            const cubeService = await server.getPrimaryService(this.config.SERVICE_UUID);
            const cubeCharacteristic = await cubeService.getCharacteristic(this.config.CHARACTERISTIC_UUID);
            console.log("Cube Service UUID:", cubeService.uuid);
            console.log("Cube Characteristic UUID:", cubeCharacteristic.uuid);
            return { cubeService, cubeCharacteristic };
        } catch (error) {
            console.error("Error discovering cube service/characteristic:", error);
            throw new Error("Could not find QiYi cube service or characteristic. Make sure the cube is nearby and advertising.");
        }
    }

    /**
       * @param {{ addEventListener: (arg0: string, arg1: (event: any) => void) => void; }} characteristic
       */
    setupDataListener(characteristic) {
        characteristic.addEventListener('characteristicvaluechanged', (/** @type {{ target: { value: any; }; }} */ event) => {
            const value = event.target.value;
            const dataArray = new Uint8Array(value.buffer);
            console.debug("Encrypted Cube Data (bytes):", dataArray);

            const decryptedData = CubeCrypto.decryptData(dataArray, this.config.KEYS[0]);
            if (!decryptedData) return;
            console.debug("Decrypted Cube Data (bytes):", decryptedData);

            this.parseCubeData(characteristic, decryptedData);
        });
    }

    /**
       * @param {any} characteristic
       * @param {string} macAddress
       */
    // @ts-ignore
    async sendHello(characteristic, macAddress) {
        if (!macAddress) {
            throw new Error('Empty MAC address');
        }
        const content = [0x00, 0x6b, 0x01, 0x00, 0x00, 0x22, 0x06, 0x00, 0x02, 0x08, 0x00];
        const macBytes = macAddress.split(':').reverse().map((/** @type {string} */ byte) => parseInt(byte, 16));
        content.push(...macBytes);
        await this.sendMessage(characteristic, new Uint8Array(content));
    }

    /**
       * @param {{ writeValue: (arg0: any) => any; }} characteristic
       * @param {Uint8Array<ArrayBuffer>} content
       */
    async sendMessage(characteristic, content) {
        if (!characteristic) {
            // @ts-ignore
            return Promise.reject("Characteristic is not available");
        }
        let msg = [0xfe];
        msg.push(4 + content.length); // 1 (op) + content.length + 2 (crc)
        // @ts-ignore
        msg.push(...content);
        const crc = CubeCrypto.crc16modbus(msg);
        msg.push(crc & 0xff, crc >> 8);

        // Pad message to a multiple of 16 bytes
        const npad = (16 - (msg.length % 16)) % 16;
        for (let i = 0; i < npad; i++) {
            msg.push(0);
        }

        const encMsg = CubeCrypto.encryptMessage(new Uint8Array(msg), this.config.KEYS[0]);
        console.debug('[qiyicube] send message to cube', msg, encMsg);
        await characteristic.writeValue(encMsg.buffer);
    }

    /**
       * @param {any} characteristic
       * @param {Uint8Array<ArrayBuffer>} msg
       */
    parseCubeData(characteristic, msg) {
        const locTime = Date.now();
        if (msg[0] !== 0xfe) {
            console.warn('[qiyicube] Invalid cube data header:', msg);
            return;
        }
        const opcode = msg[2];
        const ts = this.getCubeTimestampFromData(msg, 3);

        if (opcode === 0x02) { // Cube hello
            this.batteryLevel = msg[35];
            this.sendMessage(characteristic, msg.slice(2, 7));
            const newFacelet = CubeParser.parseFacelet(msg.slice(7, 34));

            drawFacelet(newFacelet, this.renderContainer);

            console.info('[battery] Battery level:', this.batteryLevel);
            console.info('[qiyicube] Cube hello:', newFacelet);
        } else if (opcode === 0x03) { // State change / move
            this.sendMessage(characteristic, msg.slice(2, 7));

            let todoMoves = [[msg[34], ts]];
            while (todoMoves.length < 10) {
                const off = 91 - 5 * todoMoves.length;
                const cubeTimeStamp = this.getCubeTimestampFromData(msg, off);
                const cubeMove = msg[off + 4];
                if (cubeTimeStamp <= this.lastTs) break;
                todoMoves.push([cubeMove, cubeTimeStamp]);
            }
            console.info('[qiyicube] Move:', todoMoves);
            todoMoves.sort((a, b) => a[1] - b[1]);

            const rawInputs = todoMoves.map(([move, cubeTs]) => ({
                move: CubeParser.findMove(move),
                cubeTimeStamp: cubeTs,
                timeStamp: locTime
            }));
            const moves = rawInputs.map(input => input.move)
            this.prevMoves.push(...moves);

            const newFacelet = CubeParser.parseFacelet(msg.slice(7, 34));
            console.info('[qiyicube] Facelet:', newFacelet);
            drawFacelet(newFacelet, this.renderContainer);

            // this.cubePlayer.addMoves(moves.join(" "));
            this.notifyMoves({ inputs: rawInputs, facelet: newFacelet });

            const newBatteryLevel = msg[35];
            if (newBatteryLevel !== this.batteryLevel) {
                this.batteryLevel = newBatteryLevel;
            }
        }
        this.lastTs = ts;
    }

    /**
       * @param {Uint8Array<ArrayBuffer>} data
       * @param {number} fromIdx
       */
    getCubeTimestampFromData(data, fromIdx) {
        return (data[fromIdx] << 24) | (data[fromIdx + 1] << 16) | (data[fromIdx + 2] << 8) | data[fromIdx + 3];
    }
}
