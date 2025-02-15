export class CubeParser {
  /**
   * Parses a facelet message into a 54-character string.
   * @param {Uint8Array|Array} faceMsg - The face message bytes.
   * @returns {string} - The facelet string.
   */
  static parseFacelet(faceMsg) {
    const facelets = [];
    for (let i = 0; i < 54; i++) {
      const faceIndex = Math.floor(i / 2);
      const colorIndex = (i % 2) * 4;
      facelets.push("LRDUFB".charAt((faceMsg[faceIndex] >> colorIndex) & 0xf));
    }
    return facelets.join('');
  }

  /**
   * Maps an opcode value to a cube move.
   * @param {number} msg_34 - The opcode byte.
   * @returns {string} - The cube move (e.g., "R", "U'", etc.).
   */
  static findMove(msg_34) {
    const axis = [4, 1, 3, 0, 2, 5][(msg_34 - 1) >> 1];
    const power = [0, 2][msg_34 & 1];
    const move = "URFDLB".charAt(axis) + " 2'".charAt(power);
    return move.trim();
  }

  /**
   * Linearly maps a value from one range to another.
   * @param {number} r1 - The value to map.
   * @param {number} r2 - The maximum of the original range.
   * @param {number} v1 - The minimum of the target range.
   * @param {number} v2 - The maximum of the target range.
   * @returns {number} - The mapped value.
   */
  static mapRange(r1, r2, v1, v2) {
    return v1 + (v2 - v1) * (r1 / r2);
  }

  /**
   * Returns the tempo scale based on the number of remaining moves.
   * @param {number} remainingMoves - The number of moves left.
   * @returns {number} - The tempo scale.
   */
  static getTempoScale(remainingMoves) {
    return CubeParser.mapRange(remainingMoves, 5, 2, 6);
  }
}
