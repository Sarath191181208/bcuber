

/**
 * Rotates the cube so that the face with the solved cross becomes D.
 * Depending on which face is solved, a different rotation is applied.
 * 
 * Mapping:
 *   'D' -> identity.
 *   'U' -> X2.
 *   'F' -> X′.
 *   'B' -> X.
 *   'R' -> Z⁻.
 *   'L' -> Z⁺.
 * 
 * @param {string} facelet - The 54–character cube string.
 * @param {string} crossFace - The face that has the solved cross (e.g., 'U', 'R', etc.).
 * @returns {string} The rotated facelet string with the solved cross on D.
 */
export function rotateCubeToDFace(facelet, crossFace) {
    switch (crossFace) {
        case 'D':
            return facelet;
        case 'U':
            return rotateX2(facelet);
        case 'F':
            return rotateXPrime(facelet);
        case 'B':
            return rotateX(facelet);
        case 'R':
            return rotateZPlus(facelet);
        case 'L':
            return rotateZMinus(facelet);
        default:
            throw new Error(`Unknown face: ${crossFace}`);
    }
}


/**
 * Rotates a 3x3 face (given as an array of 9 characters) by the specified angle.
 * @param {string[]} face - Array of 9 characters.
 * @param {number} angle - Rotation angle in degrees (90, -90, or 180).
 * @returns {string[]} A new array of 9 characters after rotation.
 */
function rotateFace(face, angle) {
    const rotated = new Array(9);
    if (angle === 90) {
        // 90° clockwise rotation:
        rotated[0] = face[6];
        rotated[1] = face[3];
        rotated[2] = face[0];
        rotated[3] = face[7];
        rotated[4] = face[4];
        rotated[5] = face[1];
        rotated[6] = face[8];
        rotated[7] = face[5];
        rotated[8] = face[2];
    } else if (angle === -90) {
        // 90° counterclockwise rotation:
        rotated[0] = face[2];
        rotated[1] = face[5];
        rotated[2] = face[8];
        rotated[3] = face[1];
        rotated[4] = face[4];
        rotated[5] = face[7];
        rotated[6] = face[0];
        rotated[7] = face[3];
        rotated[8] = face[6];
    } else if (angle === 180) {
        // 180° rotation:
        rotated[0] = face[8];
        rotated[1] = face[7];
        rotated[2] = face[6];
        rotated[3] = face[5];
        rotated[4] = face[4];
        rotated[5] = face[3];
        rotated[6] = face[2];
        rotated[7] = face[1];
        rotated[8] = face[0];
    } else {
        // No rotation
        return face.slice();
    }
    return rotated;
}

/**
 * Splits the 54-character facelet string into an object with face arrays.
 * @param {string} facelet
 * @returns {Object} { U, R, F, D, L, B } each as an array of 9 characters.
 */
function splitCube(facelet) {
    const arr = facelet.split('');
    return {
        U: arr.slice(0, 9),
        R: arr.slice(9, 18),
        F: arr.slice(18, 27),
        D: arr.slice(27, 36),
        L: arr.slice(36, 45),
        B: arr.slice(45, 54)
    };
}

/**
 * Recombines face arrays into a 54-character facelet string.
 * @param {Object} faces - Object with keys U, R, F, D, L, B (each an array of 9 chars).
 * @returns {string} 54-character string.
 */
function joinCube(faces) {
    return faces.U.join('') +
        faces.R.join('') +
        faces.F.join('') +
        faces.D.join('') +
        faces.L.join('') +
        faces.B.join('');
}

/**
 * Performs a rotation about the X–axis by 180° (i.e. X2).
 * This is used when the solved cross is on the U face.
 * 
 * Mapping for X2:
 *   New U = rotateFace(old D, 180)
 *   New R = rotateFace(old R, 180)
 *   New F = rotateFace(old B, 180)
 *   New D = rotateFace(old U, 180)
 *   New L = rotateFace(old L, 180)
 *   New B = rotateFace(old F, 180)
 * 
 * @param {string} facelet - 54-character cube string.
 * @returns {string} Rotated cube as a 54-character string.
 */
function rotateX2(facelet) {
    const cube = splitCube(facelet);
    const newFaces = {
        U: cube.D.slice(),
        R: rotateFace(cube.R, 180),
        F: rotateFace(cube.B, 180),
        D: cube.U.slice(),
        L: rotateFace(cube.L, 180),
        B: rotateFace(cube.F, 180)
    };
    return joinCube(newFaces);
}

/**
 * Performs a rotation about the X–axis by –90° (X′).
 * (This re–orients the cube so that the Front face becomes Down.)
 * 
 * Mapping for X′:
 *   New U = old B (no extra rotation)
 *   New F = old U (no extra rotation)
 *   New D = old F (no extra rotation)
 *   New B = old D (no extra rotation)
 *   New R = rotateFace(old R, -90)  // R rotates counterclockwise
 *   New L = rotateFace(old L, 90)   // L rotates clockwise
 * 
 * @param {string} facelet - 54-character cube string.
 * @returns {string} Rotated cube as a 54-character string.
 */
function rotateXPrime(facelet) {
    const cube = splitCube(facelet);
    const newFaces = {
        U: cube.B.slice(),       // no rotation
        R: rotateFace(cube.R, -90),
        F: cube.U.slice(),       // no rotation
        D: cube.F.slice(),       // no rotation
        L: rotateFace(cube.L, 90),
        B: rotateFace(cube.D, 180) // no rotation
    };
    return joinCube(newFaces);
}

/**
 * Performs a rotation about the X–axis by +90° (X).
 * (This re–orients the cube so that the Back face becomes Down.)
 * 
 * Mapping for X:
 *   New U = old F (no extra rotation)
 *   New F = old D (no extra rotation)
 *   New D = old B (no extra rotation)
 *   New B = old U (no extra rotation)
 *   New R = rotateFace(cube.R, 90)   // R rotates clockwise
 *   New L = rotateFace(cube.L, -90)  // L rotates counterclockwise
 * 
 * @param {string} facelet - 54-character cube string.
 * @returns {string} Rotated cube as a 54-character string.
 */
function rotateX(facelet) {
    const cube = splitCube(facelet);
    const newFaces = {
        U: cube.F.slice(),       // no rotation
        R: rotateFace(cube.R, 90),
        F: cube.D.slice(),       // no rotation
        D: rotateFace(cube.B, 180),       // no rotation
        L: rotateFace(cube.L, -90),
        B: rotateFace(cube.U.slice(), 180)
    };
    return joinCube(newFaces);
}

/**
 * Performs a rotation about the Z–axis by +90° (Z⁺).
 * (This re–orients the cube so that the Left face becomes Down.)
 * 
 * Mapping for Z⁺:
 *   New U = rotateFace(old L, 90)
 *   New R = rotateFace(old U, 90)
 *   New D = rotateFace(old R, 90)
 *   New L = rotateFace(old D, 90)
 *   New F = rotateFace(old F, 90)
 *   New B = rotateFace(old B, -90)
 * 
 * @param {string} facelet - 54-character cube string.
 * @returns {string} Rotated cube as a 54-character string.
 */
function rotateZPlus(facelet) {
    const cube = splitCube(facelet);
    const newFaces = {
        U: rotateFace(cube.L, 90),
        R: rotateFace(cube.U, 90),
        F: rotateFace(cube.F, 90),
        D: rotateFace(cube.R, 90),
        L: rotateFace(cube.D, 90),
        B: rotateFace(cube.B, -90)
    };
    return joinCube(newFaces);
}

/**
 * Performs a rotation about the Z–axis by –90° (Z⁻).
 * (This re–orients the cube so that the Right face becomes Down.)
 * 
 * Mapping for Z⁻:
 *   New U = rotateFace(old R, -90)
 *   New R = rotateFace(old D, -90)
 *   New D = rotateFace(old L, -90)
 *   New L = rotateFace(old U, -90)
 *   New F = rotateFace(old F, -90)
 *   New B = rotateFace(cube.B, 90)
 * 
 * @param {string} facelet - 54-character cube string.
 * @returns {string} Rotated cube as a 54-character string.
 */
function rotateZMinus(facelet) {
    const cube = splitCube(facelet);
    const newFaces = {
        U: rotateFace(cube.R, -90),
        R: rotateFace(cube.D, -90),
        F: rotateFace(cube.F, -90),
        D: rotateFace(cube.L, -90),
        L: rotateFace(cube.U, -90),
        B: rotateFace(cube.B, 90)
    };
    return joinCube(newFaces);
}