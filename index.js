// Constants (defined outside the functions for easy access)
const QI_YI_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const QI_YI_CHARACTERISTIC_UUID = '0000fff6-0000-1000-8000-00805f9b34fb';
const QI_YI_CIC_LIST = [0x0504]; // You might not need this for direct connection
const QI_YI_KEYS = ['NoDg7ANAjGkEwBYCc0xQnADAVgkzGAzHNAGyRTanQi5QIFyHrjQMQgsC6QA'];
const QI_YI_CUBE_CHARACTERISTIC_UUID_PATTERN = "fff6"; // Might not be needed anymore
const macAddress = "CC:A3:00:00:85:2A"; // Example MAC address


let curCubie = new mathlib.CubieCube();
let prevCubie = new mathlib.CubieCube();

const SOLVED_FACELET = mathlib.SOLVED_FACELET;

let prevMoves = [];
let lastTs = 0;
let batteryLevel = 0;


async function connectQiYiCube() {
    try {
        const device = await requestBluetoothDevice();
        console.log({ device });
        console.table({ id: device.id, address: device.address })
        const server = await connectGattServer(device);
        const { cubeService, cubeCharacteristic } = await discoverCubeServiceAndCharacteristic(server);

        setupDataListener(cubeCharacteristic);
        await startNotifications(cubeCharacteristic);

        console.log("QiYi Cube connected and listening for data!");

        await sendHello(cubeCharacteristic, macAddress);

    } catch (error) {
        console.error("Error connecting to QiYi Cube:", error);
    }
}

async function requestBluetoothDevice() {
    if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth API is not available in this browser.");
    }
    return navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // No longer needed - connect directly by service UUID
        optionalServices: [QI_YI_SERVICE_UUID]
        // filters: [{ services: [QI_YI_SERVICE_UUID] }] // Filter by the QiYi service UUID
    });
}

async function connectGattServer(device) {
    return device.gatt.connect();
}

async function discoverCubeServiceAndCharacteristic(server) {
    try {
        const cubeService = await server.getPrimaryService(QI_YI_SERVICE_UUID);
        console.log(cubeService.getCharacteristics())
        const cubeCharacteristic = await cubeService.getCharacteristic(QI_YI_CHARACTERISTIC_UUID);

        console.log("Cube Service UUID:", cubeService.uuid);
        console.log("Cube Characteristic UUID:", cubeCharacteristic.uuid);

        return { cubeService, cubeCharacteristic };

    } catch (error) {
        console.error("Error discovering QiYi service or characteristic:", error);
        throw new Error("Could not find QiYi cube service or characteristic.  Check if the cube is nearby and advertising.");
    }
}

async function startNotifications(characteristic) {
    const x = await characteristic.startNotifications();
    console.log({ x });
}

function setupDataListener(characteristic) {
    characteristic.addEventListener('characteristicvaluechanged', event => {
        var value = event.target.value;
        var dataArray = [];
        for (var i = 0; i < value.byteLength; i++) {
            dataArray[i] = value.getUint8(i);
        }
        console.log("Encrypted Cube Data (bytes):", dataArray);

        // **DECRYPT the data here using QI_YI_KEYS and the AES algorithm.**
        const decryptedData = decryptData(dataArray, QI_YI_KEYS[0]); // Example - implement decryptData()

        console.log("Decrypted Cube Data (bytes):", decryptedData);

        parseCubeData(characteristic, decryptedData);
    });
}

function decryptData(encMsg) {
    let decoder = $.aes128(JSON.parse(LZString.decompressFromEncodedURIComponent(QI_YI_KEYS[0])));
    var msg = [];
    for (var i = 0; i < encMsg.length; i += 16) {
        var block = encMsg.slice(i, i + 16);
        decoder.decrypt(block);
        for (var j = 0; j < 16; j++) {
            msg[i + j] = block[j];
        }
    }
    msg = msg.slice(0, msg[1]);
    if (msg.length < 3 || crc16modbus(msg) != 0) {
        console.error("Invalid message", msg);
        return null;
    }
    return msg;
}

function crc16modbus(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x1) > 0 ? (crc >> 1) ^ 0xa001 : crc >> 1;
        }
    }
    return crc;
}

function sendMessage(characteristic, content) {  // Modified to take characteristic
    if (!characteristic) { // Check if characteristic is available
        return Promise.reject("Characteristic is not available");
    }

    let msg = [0xfe];
    msg.push(4 + content.length); // length = 1 (op) + cont.length + 2 (crc)
    msg.push(...content); // Use spread syntax to add content to msg

    const crc = crc16modbus(msg);
    msg.push(crc & 0xff, crc >> 8);
    const npad = (16 - msg.length % 16) % 16;
    for (let i = 0; i < npad; i++) {
        msg.push(0);
    }

    decoder = $.aes128(JSON.parse(LZString.decompressFromEncodedURIComponent(QI_YI_KEYS[0]))); // Initialize decoder only once

    const encMsg = [];
    for (let i = 0; i < msg.length; i += 16) {
        let block = msg.slice(i, i + 16);
        decoder.encrypt(block);
        for (let j = 0; j < 16; j++) {
            encMsg[i + j] = block[j];
        }
    }

    console.log('[qiyicube] send message to cube', msg, encMsg);
    return characteristic.writeValue(new Uint8Array(encMsg).buffer); // Write to the characteristic
}


async function sendHello(characteristic, macAddress) {
    if (!macAddress) {
        throw new Error('Empty MAC address');
    }

    const content = [0x00, 0x6b, 0x01, 0x00, 0x00, 0x22, 0x06, 0x00, 0x02, 0x08, 0x00];
    // const content = [0, 107, 1, 0, 0, 34, 6, 0, 2, 8, 0, 42, 133, 0, 0, 163, 204];
    // const content = [0x0, 0x6b, 0x1, 0x0, 0x0, 0x22, 0x6, 0x0, 0x2, 0x8, 0x0, 0x2a, 0x85, 0x0, 0x0, 0xa3, 0xcc];
    const macBytes = macAddress.split(':').reverse().map(byte => parseInt(byte, 16));
    content.push(...macBytes);

    return sendMessage(characteristic, new Uint8Array(content));
}

function toUuid128(uuid) {
    if (/^[0-9A-Fa-f]{4}$/.exec(uuid)) {
        uuid = "0000" + uuid + "-0000-1000-8000-00805F9B34FB";
    }
    return uuid.toUpperCase();
}

function parseCubeData(characteristic, msg) {
    const locTime = Date.now(); // Use standard JS Date.now()
    if (msg[0] !== 0xfe) {
        console.warn('[qiyicube] Invalid cube data header:', msg); // Use console.warn for invalid data
        return; // Early exit on invalid data
    }

    const opcode = msg[2];
    const ts = (msg[3] << 24) | (msg[4] << 16) | (msg[5] << 8) | msg[6]; // Bitwise operations for timestamp

    if (opcode === 0x02) { // Cube hello
        const batteryLevel = msg[35];
        sendMessage(characteristic, msg.slice(2, 7)); // Send response
        const newFacelet = parseFacelet(msg.slice(7, 34));

        prevCubie.fromFacelet(newFacelet);

        console.log('[battery] Battery level:', batteryLevel);
        console.log('[qiyicube] Cube hello:', newFacelet);

    } else if (opcode === 0x03) { // State change
        sendMessage(characteristic, msg.slice(2, 7));

        let todoMoves = [[msg[34], ts]];
        let offset = 91; // Start offset for historical moves

        while (todoMoves.length < 10) {
            offset -= 5;
            if (offset < 7) break; // Check for valid offset

            const hisTs = (msg[offset] << 24) | (msg[offset + 1] << 16) | (msg[offset + 2] << 8) | msg[offset + 3];
            const hisMv = msg[offset + 4];

            if (hisTs <= lastTs) {
                break;
            }
            todoMoves.push([hisMv, hisTs]);
        }

        if (todoMoves.length > 1) {
            console.log('[qiyicube] Missed historical moves:', JSON.stringify(todoMoves), lastTs);
        }

        const toCallback = [];
        let curFacelet;

        for (let i = todoMoves.length - 1; i >= 0; i--) {
            const moveIndex = todoMoves[i][0] - 1;
            const axis = [4, 1, 3, 0, 2, 5][Math.floor(moveIndex / 2)]; // Use Math.floor for integer division
            const power = [0, 2][moveIndex % 2];
            const m = axis * 3 + power;

            // Assuming mathlib.CubieCube and related functions are defined.
            mathlib.CubieCube.CubeMult(prevCubie, mathlib.CubieCube.moveCube[m], curCubie);
            prevMoves.unshift("URFDLB".charAt(axis) + " 2'".charAt(power));
            prevMoves = prevMoves.slice(0, 8);
            curFacelet = curCubie.toFaceCube();
            toCallback.push([curFacelet, prevMoves.slice(), [Math.trunc(todoMoves[i][1] / 1.6), locTime]]);

            const tmp = curCubie;
            curCubie = prevCubie;
            prevCubie = tmp;
        }

        const newFacelet = parseFacelet(msg.slice(7, 34));

        if (newFacelet !== curFacelet) {
            console.log('[qiyicube] Facelet:', newFacelet);
            curCubie.fromFacelet(newFacelet);

            const tmp = curCubie;
            curCubie = prevCubie;
            prevCubie = tmp;
        } else {
            // for (const callbackArgs of toCallback) { // Use for...of loop
                // GiikerCube.callback.apply(null, callbackArgs);
            // }
        }

        const newBatteryLevel = msg[35];
        if (newBatteryLevel !== batteryLevel) {
            batteryLevel = newBatteryLevel;
        }
    }

    drawCube(curCubie);

    lastTs = ts;
}

function drawCube(cube) {
}

function parseFacelet(faceMsg) {
    const facelets = [];
    for (let i = 0; i < 54; i++) {
        const faceIndex = Math.floor(i / 2); // Integer division
        const colorIndex = (i % 2) * 4;
        facelets.push("LRDUFB".charAt((faceMsg[faceIndex] >> colorIndex) & 0xf));
    }
    return facelets.join("");
}


// Event listener for the "Connect Cube" button
document.getElementById("connectCube")?.addEventListener("click", connectQiYiCube);

