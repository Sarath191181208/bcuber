/**
 * @typedef {Object} Mapping
 * @property {string} U - Up face mapping
 * @property {string} D - Down face mapping
 * @property {string} F - Front face mapping
 * @property {string} B - Back face mapping
 * @property {string} R - Right face mapping
 * @property {string} L - Left face mapping
 */

/**
 * Applies an x rotation (clockwise about the R–L axis) to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the x rotation.
 */
function applyX(mapping) {
  return {
    U: mapping.F,
    F: mapping.D,
    D: mapping.B,
    B: mapping.U,
    R: mapping.R,
    L: mapping.L,
  };
}

/**
 * Applies an x' (inverse x) rotation to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the x' rotation.
 */
function applyXPrime(mapping) {
  return {
    U: mapping.B,
    B: mapping.D,
    D: mapping.F,
    F: mapping.U,
    R: mapping.R,
    L: mapping.L,
  };
}

/**
 * Applies an x2 (180° x) rotation to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the x2 rotation.
 */
function applyX2(mapping) {
  return {
    U: mapping.D,
    D: mapping.U,
    F: mapping.B,
    B: mapping.F,
    R: mapping.R,
    L: mapping.L,
  };
}

/**
 * Applies a y rotation (clockwise about the U–D axis) to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the y rotation.
 */
function applyY(mapping) {
  return {
    U: mapping.U,
    D: mapping.D,
    F: mapping.R,
    R: mapping.B,
    B: mapping.L,
    L: mapping.F,
  };
}

/**
 * Applies a y' (inverse y) rotation to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the y' rotation.
 */
function applyYPrime(mapping) {
  return {
    U: mapping.U,
    D: mapping.D,
    F: mapping.L,
    L: mapping.B,
    B: mapping.R,
    R: mapping.F,
  };
}

/**
 * Applies a y2 (180° y) rotation to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the y2 rotation.
 */
function applyY2(mapping) {
  return {
    U: mapping.U,
    D: mapping.D,
    F: mapping.B,
    B: mapping.F,
    R: mapping.L,
    L: mapping.R,
  };
}

/**
 * Applies a z rotation (clockwise about the F–B axis) to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the z rotation.
 */
function applyZ(mapping) {
  return {
    U: mapping.R,
    R: mapping.D,
    D: mapping.L,
    L: mapping.U,
    F: mapping.F,
    B: mapping.B,
  };
}

/**
 * Applies a z' (inverse z) rotation to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the z' rotation.
 */
function applyZPrime(mapping) {
  return {
    U: mapping.L,
    L: mapping.D,
    D: mapping.R,
    R: mapping.U,
    F: mapping.F,
    B: mapping.B,
  };
}

/**
 * Applies a z2 (180° z) rotation to the mapping.
 * @param {Mapping} mapping - The current face mapping.
 * @returns {Mapping} The new mapping after the z2 rotation.
 */
function applyZ2(mapping) {
  return {
    U: mapping.D,
    D: mapping.U,
    R: mapping.L,
    L: mapping.R,
    F: mapping.F,
    B: mapping.B,
  };
}

/**
 * Processes a sequence of moves by absorbing cube rotations into face moves.
 * Cube rotations (x, y, z, and their variants) update the current mapping.
 * Face moves (R, U, F, B, D, L with optional suffixes) are remapped accordingly.
 *
 * @param {string[]} moves - The list of moves (e.g., ["x'", "R", "U", "y2", "L", "z", "F'"]).
 * @returns {string[]} The resulting move sequence with rotations absorbed.
 */
export function normalizeRotationsInMoves(moves) {
  // Start with the identity mapping.
  let mapping = {
    U: "U",
    D: "D",
    F: "F",
    B: "B",
    R: "R",
    L: "L",
  };

  const result = [];

  moves.forEach((move) => {
    switch (move) {
      case "x":
        mapping = applyX(mapping);
        break;
      case "x'":
        mapping = applyXPrime(mapping);
        break;
      case "x2":
        mapping = applyX2(mapping);
        break;
      case "y":
        mapping = applyY(mapping);
        break;
      case "y'":
        mapping = applyYPrime(mapping);
        break;
      case "y2":
        mapping = applyY2(mapping);
        break;
      case "z":
        mapping = applyZ(mapping);
        break;
      case "z'":
        mapping = applyZPrime(mapping);
        break;
      case "z2":
        mapping = applyZ2(mapping);
        break;
      default:
        // Assume move is a face move (e.g., "R", "U", "F'", etc.)
        const face = move[0]; // Extract the face letter
        const suffix = move.slice(1); // Extract any modifiers (like ' or 2)
        result.push(mapping[face] + suffix);
        break;
    }
  });

  return result;
}