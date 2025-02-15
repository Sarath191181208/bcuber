import { getCrossSolvedColor } from "./faceletCrossChecker";
import { drawFacelet } from "../qiyi/simple2dRender";
import { rotateCubeToDFace } from "./utils";

/**
 * Checks if the OLL (Orientation of the Last Layer) is solved.
 * The function assumes the cube has a solved cross (now on D) so that the last layer is U.
 * It verifies that all U face stickers (excluding the center) match the U–center color.
 *
 * @param {string} facelet - A 54–character string representing the cube’s facelets.
 * @returns {boolean | null} True if the OLL is solved (all U face stickers are correct),
 *                           false if not, or null if no cross is solved or if rotation fails.
 */
export function getOLLSolved(facelet, crossFace) {
    let orientedFacelet;
    try {
        orientedFacelet = rotateCubeToDFace(facelet, crossFace);
    } catch (err) {
        console.error(err);
        return null;
    }

    // @ts-ignore
    drawFacelet(orientedFacelet, document.getElementById("debug-cube-container-2"));

    const faceletArray = orientedFacelet.split('');
    // Get centers from fixed positions.
    const centers = {
        U: faceletArray[4],
        R: faceletArray[13],
        F: faceletArray[22],
        D: faceletArray[31],
        L: faceletArray[40],
        B: faceletArray[49]
    };

    // For OLL (with D cross), the U face is the last layer.
    // U face indices: 0,1,2,3,4,5,6,7,8 (center at index 4 is fixed)
    const UColor = centers.U;
    // Exclude the center (index 4) since it's fixed.
    const uIndices = [0, 1, 2, 3, 5, 6, 7, 8];
    const ollSolved = uIndices.every(idx => faceletArray[idx] === UColor);

    console.log("[OLL]:", ollSolved ? "OLL is solved." : "OLL is not solved.");
    return ollSolved;
}
