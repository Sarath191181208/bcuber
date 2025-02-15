//@ts-check
import LZString from 'lz-string';
import { AES128 } from '../sha256';

export class CubeCrypto {
    /**
     * Decrypts an encrypted message using AES-128.
     * @param {Uint8Array} encMsg - The encrypted message.
     * @param {string} keyStr - The LZString-compressed key.
     * @returns {Uint8Array|null} - The decrypted message or null if invalid.
     */
    static decryptData(encMsg, keyStr) {
        const keyObj = JSON.parse(LZString.decompressFromEncodedURIComponent(keyStr));
        const decoder = new AES128(keyObj);
        let msg = [];

        for (let i = 0; i < encMsg.length; i += 16) {
            const block = Array.from(encMsg.slice(i, i + 16));
            decoder.decrypt(block);
            msg.push(...block);
        }
        // The message length is stored in msg[1]
        msg = msg.slice(0, msg[1]);

        if (msg.length < 3 || CubeCrypto.crc16modbus(msg) !== 0) {
            console.error("Invalid message", msg);
            return null;
        }
        return new Uint8Array(msg);
    }

    /**
     * Encrypts a message using AES-128.
     * @param {Uint8Array} msg - The plaintext message.
     * @param {string} keyStr - The LZString-compressed key.
     * @returns {Uint8Array} - The encrypted message.
     */
    static encryptMessage(msg, keyStr) {
        const keyObj = JSON.parse(LZString.decompressFromEncodedURIComponent(keyStr));
        const encoder = new AES128(keyObj);
        const encMsg = new Uint8Array(msg.length);

        for (let i = 0; i < msg.length; i += 16) {
            const block = Array.from(msg.slice(i, i + 16));
            encoder.encrypt(block);
            for (let j = 0; j < 16; j++) {
                encMsg[i + j] = block[j];
            }
        }
        return encMsg;
    }

    /**
     * Computes the CRC-16 (Modbus) checksum.
     * @param {Array|Uint8Array} data - The data array.
     * @returns {number} - The computed CRC.
     */
    static crc16modbus(data) {
        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x1) ? (crc >> 1) ^ 0xa001 : crc >> 1;
            }
        }
        return crc;
    }
}
