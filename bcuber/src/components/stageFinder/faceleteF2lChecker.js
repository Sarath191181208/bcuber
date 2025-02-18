import { getCrossSolvedColor } from "./faceletCrossChecker";
import { drawFacelet } from "../qiyi/simple2dRender";
import { rotateCubeToDFace } from "./utils";
/**
 * Checks which F2L pairs (for a cube with the solved cross now on D) are solved.
 * The mapping used below (for the D–cross orientation) is:
 *
 * DFR:
 *   - Corner: { D: 29, F: 26, R: 15 }
 *   - Edge:   { F: 23, R: 12 }
 *
 * DRB:
 *   - Corner: { D: 35, R: 17, B: 51 }
 *   - Edge:   { B: 48, R: 14 }
 *
 * DBL:
 *   - Corner: { D: 33, B: 53, L: 44 }
 *   - Edge:   { B: 50, L: 39 }
 *
 * DLF:
 *   - Corner: { D: 27, L: 42, F: 24 }
 *   - Edge:   { F: 21, L: 41 }
 *
 * @param {string} facelet - A 54–character string representing the cube’s facelets.
 * @returns {import("../../types").F2LIsSlotSolved | null} An object with F2L slot keys (DFR, DRB, DBL, DLF) and boolean values,
 *                        or null if no cross is solved or if rotation fails.
 */
export function getF2LPairsSolved(facelet, crossFace) {
    // check only if the current cross face is solved 
    const solvedCrossColor = getCrossSolvedColor(facelet);
    if (solvedCrossColor !== crossFace) {
        console.warn(`[F2L]: Cross is not solved on ${crossFace}.`);
        return null;
    }
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

    // D–cross F2L mapping (using fixed indices for a standard cube):
    const f2lMappingForD = {
        DFR: {
            corner: { D: 29, F: 26, R: 15 },
            edge: { F: 23, R: 12 }
        },
        DRB: {
            corner: { D: 35, R: 17, B: 51 },
            edge: { R: 14, B: 48 }
        },
        DBL: {
            corner: { D: 33, B: 53, L: 42 },
            edge: { B: 50, L: 39 }
        },

        DLF: {
            corner: { D: 27, F: 24, L: 44 },
            edge: { F: 21, L: 41 }
        },
    };

    const solvedF2L = {};

    for (const [slot, mapping] of Object.entries(f2lMappingForD)) {
        // Check corner stickers.
        const cornerSolved = Object.entries(mapping.corner).every(([face, idx]) => {
            return faceletArray[idx] === centers[face];
        });
        // Check edge stickers.
        const edgeSolved = Object.entries(mapping.edge).every(([face, idx]) => {
            return faceletArray[idx] === centers[face];
        });
        solvedF2L[slot] = cornerSolved && edgeSolved;
        if (cornerSolved && edgeSolved) {
            console.log(`[F2L]: ${slot} is solved.`);
        }
    }

    console.log("[F2L]: ", { solvedF2L })

    // @ts-ignore
    return solvedF2L;
}