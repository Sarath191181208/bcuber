// Description: This file contains the functions that check if a facelet is solved or not.
/**
 * @param {string} facelet
 */
export function isFaceletSolved(facelet) {
    return facelet === "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
}


/**
 * @param {string} facelet
 * @returns {string | null} The color of the solved cross, or null if no cross is solved.
 */
export function getCrossSolvedColor(facelet) {
    const faceletArray = facelet.split('');
    const faces = {
        U: faceletArray.slice(0, 9),
        R: faceletArray.slice(9, 18),
        F: faceletArray.slice(18, 27),
        D: faceletArray.slice(27, 36),
        L: faceletArray.slice(36, 45),
        B: faceletArray.slice(45, 54)
    };

    for (const [face, facelet] of Object.entries(faces)) {
        if (_isCrossSolved(facelet, face, faceletArray)) {
            return face;
        }
    }
    return null;
}

/**
 * Checks if a face has a solved cross that is properly aligned.
 * @param {string[]} singleFace - The facelet colors for a given face.
 * @param {string} color - The expected center color.
 * @param {string[]} faceletArray - The full cube facelets.
 * @returns {boolean}
 */
function _isCrossSolved(singleFace, color, faceletArray) {
    // Ensure cross pattern on the given face
    if (!(singleFace[1] === color && singleFace[3] === color && singleFace[5] === color && singleFace[7] === color)) {
        return false;
    }

    // Ensure edge stickers match adjacent face centers
    const adjacentCenters = {
        U: [faceletArray[13], faceletArray[22], faceletArray[49], faceletArray[40]], // R, F, L, B centers
        R: [faceletArray[4], faceletArray[22], faceletArray[31], faceletArray[49]], // U, F, D, B centers
        F: [faceletArray[4], faceletArray[13], faceletArray[31], faceletArray[40]], // U, R, D, L centers
        D: [faceletArray[13], faceletArray[22], faceletArray[49], faceletArray[40]], // R, F, L, B centers
        L: [faceletArray[4], faceletArray[49], faceletArray[31], faceletArray[22]], // U, B, D, F centers
        B: [faceletArray[4], faceletArray[40], faceletArray[31], faceletArray[13]]  // U, L, D, R centers
    };

    const crossEdges = {
        U: [faceletArray[10], faceletArray[19], faceletArray[46], faceletArray[37]],
        R: [faceletArray[5], faceletArray[23], faceletArray[32], faceletArray[48]],
        F: [faceletArray[7], faceletArray[12], faceletArray[28], faceletArray[41]],
        D: [faceletArray[16], faceletArray[25], faceletArray[52], faceletArray[43]],
        L: [faceletArray[3], faceletArray[50], faceletArray[30], faceletArray[21]],
        B: [faceletArray[1], faceletArray[39], faceletArray[34], faceletArray[14]]
    };

    return crossEdges[color].every((edge, idx) => edge === adjacentCenters[color][idx]);
}
