import { mathlib } from "./mathlib.js"

// Constants (defined outside the functions for easy access)
const QI_YI_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const QI_YI_CHARACTERISTIC_UUID = '0000fff6-0000-1000-8000-00805f9b34fb';
const QI_YI_CIC_LIST = [0x0504]; // You might not need this for direct connection
const QI_YI_KEYS = ['NoDg7ANAjGkEwBYCc0xQnADAVgkzGAzHNAGyRTanQi5QIFyHrjQMQgsC6QA'];
const QI_YI_CUBE_CHARACTERISTIC_UUID_PATTERN = "fff6"; // Might not be needed anymore
const macAddress = "CC:A3:00:00:85:2A"; // Example MAC address

const twistyPlayer = document.getElementById('main-player');


let curCubie = new mathlib.CubieCube();
let prevCubie = new mathlib.CubieCube();

const SOLVED_FACELET = mathlib.SOLVED_FACELET;

// type CubeMove = {
//     ts: timestamp
//     move: R | R' |  L | L' |  U | U' |  D | D' |  F | F' |  B | B'
// }
let rawInputs = [];

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
        console.debug("Encrypted Cube Data (bytes):", dataArray);

        // **DECRYPT the data here using QI_YI_KEYS and the AES algorithm.**
        const decryptedData = decryptData(dataArray, QI_YI_KEYS[0]); // Example - implement decryptData()

        console.debug("Decrypted Cube Data (bytes):", decryptedData);

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

    console.debug('[qiyicube] send message to cube', msg, encMsg);
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

function getCubeTimestampFromData(data, fromIdx) {
    return (data[fromIdx] << 24) | (data[fromIdx + 1] << 16) | (data[fromIdx + 2] << 8) | data[fromIdx + 3];
}

function parseCubeData(characteristic, msg) {
    const locTime = Date.now(); // Use standard JS Date.now()
    if (msg[0] !== 0xfe) {
        console.warn('[qiyicube] Invalid cube data header:', msg); // Use console.warn for invalid data
        return; // Early exit on invalid data
    }

    const opcode = msg[2];
    const ts = getCubeTimestampFromData(msg, 3); // Bitwise operations for timestamp

    if (opcode === 0x02) { // Cube hello
        const batteryLevel = msg[35];
        sendMessage(characteristic, msg.slice(2, 7)); // Send response
        const newFacelet = parseFacelet(msg.slice(7, 34));

        drawCube(curCubie, 'cubeContainer');

        prevCubie.fromFacelet(newFacelet);

        console.info('[battery] Battery level:', batteryLevel);
        console.info('[qiyicube] Cube hello:', newFacelet);

    } else if (opcode === 0x03) { // State change
        sendMessage(characteristic, msg.slice(2, 7));

        let todoMoves = [[msg[34], ts]];
        while (todoMoves.length < 10) {
            let off = 91 - 5 * todoMoves.length;
            let cubeTimeStamp = getCubeTimestampFromData(msg, off);
            let cubeMove = msg[off + 4];
            if (cubeTimeStamp <= lastTs) {
                break;
            }
            todoMoves.push([cubeMove, cubeTimeStamp]);
        }

        console.info('[qiyicube] Move:', todoMoves);

        todoMoves.sort((a, b) => a[1] - b[1]);

        let rawInputs = todoMoves.map(([move, ts]) => {
            return { move: findMove(move), cubeTimeStamp: ts, timeStamp: locTime };
        });

        let moves = rawInputs.map(({ move }) => move);
        prevMoves.push(...moves);

        // rawInputs.push({ timeStamp: locTime, move, cubeTimeStamp: ts });
        // prevMoves.push(move);

        const newFacelet = parseFacelet(msg.slice(7, 34));

        console.info('[qiyicube] Facelet:', newFacelet);
        curCubie.fromFacelet(newFacelet);

        drawCube(curCubie, 'cubeContainer');

        // animate the twisty cube 
        playMove();

        const newBatteryLevel = msg[35];
        if (newBatteryLevel !== batteryLevel) {
            batteryLevel = newBatteryLevel;
        }
    }

    lastTs = ts;
}

let currentIndex = 0;
let isPlaying = false;

function playMove() {
    // If nothing is currently playing, start the playback.
    if (!isPlaying) {
        isPlaying = true;
        processNextMove();
    }
}

function processNextMove() {
    // If we've played all moves in the list, reset and exit.
    if (currentIndex >= prevMoves.length) {
        twistyPlayer.tempoScale = 2;
        isPlaying = false;
        return;
    }

    // Get the next move using the current index.
    const nextMove = prevMoves[currentIndex];
    console.log("[Playing]: ", { nextMove, currentIndex });
    currentIndex++;

    // Calculate how many moves remain and adjust the tempo accordingly.
    const remaining = prevMoves.length - currentIndex;
    const scale = getTempoScale(remaining);
    twistyPlayer.tempoScale = scale;

    console.log({ scale });

    // Execute the move.
    twistyPlayer.experimentalAddMove(nextMove);

    // Set a base delay. When the tempoScale increases, the delay decreases.
    const baseDelay = 1000;
    const delay = baseDelay / scale;

    // Schedule the next move.
    setTimeout(processNextMove, delay);
}

function mapRange(r1, r2, v1, v2) {
    return v1 + (v2 - v1) * (r1 / r2);
}

function getTempoScale(remainingMoves) {
    // This maps the number of remaining moves (up to 5) to a tempo between 2 and 6.
    return mapRange(remainingMoves, 5, 2, 6);
}


function handleSliceMoves(move, rawInputs) {
    if (rawInputs.length < 2) {
        return move;
    }
    let currMoveRaw = rawInputs[rawInputs.length - 1];
    let prevMoveRaw = rawInputs[rawInputs.length - 2];

    // check if the time between both the moves is less than 5ms 
    const TIME_DIFF = 10 * 1000; // MS
    if ((currMoveRaw.timeStamp - prevMoveRaw.timeStamp) > TIME_DIFF) {
        return move;
    }

    let currMove = currMoveRaw.move;
    let prevMove = prevMoveRaw.move;

    const removeReverseTags = (move) => {
        return move.replace(/'/g, '').trim().toUpperCase();
    };

    let alternateMoves = {
        "U": "D",
        "F": "B",
        "R": "L",
    };

    const x = removeReverseTags(currMove);
    const y = removeReverseTags(prevMove);
    if (!(alternateMoves[x] === y || alternateMoves[y] === x)) {
        return move;
    }

    // check if the moves are in the same dir i.e both are clockwise or both are anti-clockwise
    const isPrevAlternativeToCurr = currMove.includes("'") && !prevMove.includes("'");
    const isCurrAlternativeToPrev = !currMove.includes("'") && prevMove.includes("'");
    if (!(isPrevAlternativeToCurr || isCurrAlternativeToPrev)) {
        return move;
    }

    // find out which slice move it is
    const res = findSlice(currMove, prevMove);
    if (res === undefined) {
        throw new Error(`Invalid slice moves", ${{ currMove, prevMove }}`);
    }

    // remove the last move from the prevMoves
    prevMoves.pop();

    return res;
}

function findSlice(x, y) {
    x = x.toUpperCase();
    y = y.toUpperCase();

    // normalizing to reduce cases
    if (y.includes("U") || y.includes("F") || y.includes("R")) {
        const temp = x;
        x = y;
        y = temp;
    }

    const sliceCaseMap = {
        "UD'": "E'",
        "U'D": "E",
        "FB'": "S",
        "F'B": "S'",
        "RL'": "M",
        "R'L": "M'"
    }

    return sliceCaseMap[x + y];
}

function _is(movePair1, movePair2) {
    const [x1, y1] = movePair1;
    const [x2, y2] = movePair2;
    return (x1 === x2 && y1 === y2);
}

function findMove(msg_34) {
    let axis = [4, 1, 3, 0, 2, 5][(msg_34 - 1) >> 1];
    let power = [0, 2][msg_34 & 1];
    let move = "URFDLB".charAt(axis) + " 2'".charAt(power);
    return move.trim();
}

function drawCube(cube, container) {
    const facelets = cube.toFaceCube();
    console.log("[Drawing]: ", { facelets })

    const faceColors = {
        'U': 'white',
        'R': 'red',
        'F': 'green',
        'D': 'yellow',
        'L': 'orange',
        'B': 'blue'
    };

    const cubeContainer = document.getElementById(container);
    cubeContainer.innerHTML = ''; // Clear previous faces

    const faceNames = ['U', 'R', 'F', 'D', 'L', 'B'];


    faceNames.forEach(faceName => {
        const face = document.createElement('div');
        face.classList.add('cube-face');
        face.style.width = '60px'; // Adjust size as needed
        face.style.height = '60px';
        face.style.border = '1px solid black';
        face.style.display = 'grid';
        face.style.gridTemplateColumns = 'repeat(3, 1fr)';
        face.style.gridTemplateRows = 'repeat(3, 1fr)';

        const index = faceNames.indexOf(faceName);
        const faceletString = (facelets.substring(index * 9, (index + 1) * 9));

        console.debug({ faceletString, index, faceName, color: faceColors[faceName] });

        for (let i = 0; i < 9; i++) {

            const color = faceColors[faceletString[i]];
            const sticker = document.createElement('div');
            sticker.style.backgroundColor = color;
            sticker.style.border = '1px solid black';
            face.appendChild(sticker);
        }
        cubeContainer.appendChild(face);
    });

    // Arrange faces in a "flat" or "open box" layout.  Adjust as needed.
    const faces = cubeContainer.querySelectorAll('.cube-face');

    faces[0].style.top = '0px';      // U
    faces[0].style.left = '60px';   // U

    faces[1].style.top = '60px';     // R
    faces[1].style.left = '120px';  // R

    faces[2].style.top = '60px';     // F
    faces[2].style.left = '60px';   // F

    faces[3].style.top = '120px';    // D
    faces[3].style.left = '60px';   // D

    faces[4].style.top = '60px';     // L
    faces[4].style.left = '0px';    // L

    faces[5].style.top = '60px';     // B
    faces[5].style.left = '180px';  // B
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

