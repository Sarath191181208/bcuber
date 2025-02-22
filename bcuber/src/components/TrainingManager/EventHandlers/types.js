/**
 * @typedef {Object} CubeEvent
 * @property {string} name
 * @property {any} data
 */

// normal cfop events enum
/**
 * @enum {string}
 */
export const CFOPCubeSolvingPhase = {
  SCRAMBLED: "SCRAMBLED",
  CROSS_SOLVED: "CROSS_SOLVED",
  F2L_PROGRESS: "F2L_PROGRESS",
  F2l_COMPLETE: "F2L_COMPLETE",
  OLL: "OLL",
  PLL: "PLL",
  SOLVED: "SOLVED"
}