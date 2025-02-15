
/**
 * @enum {string}
 */
export const CubeState = {
    SCRAMBLING: "SCRAMBLING",
    SCRAMBLING_COMPLETE: "SCRAMBLING_COMPLETE",
    INSPECTING: "INSPECTING",
    SOLVING: "SOLVING",
    LIVE: "LIVE",
    SOLVED: "SOLVED"
}

/**
 * @enum {string}
 */
export const CubeSolvingStateEnum = {
    SCRAMBLED: "SCRAMBLED",
    CROSS_SOLVED: "CROSS",
    F2L: "F2L",
    OLL: "OLL",
    PLL: "PLL"
}

// {color: string | null, state: CubeSolvingState | null, misc: {f2lSolved: number | null}}
/**
 * @typedef {Object} CubeSolvingState
 */
export const cubeSolvingState = {
    color: null,
    state: null,
    misc: {
        f2lSolved: null
    }
}

// { DFR: boolean, DRB: boolean, DBL: boolean, DLF: boolean }
/**
 * @typedef {Object} F2LIsSlotSolved
 */
export const f2lsolved = {
    DFR: false,
    DRB: false,
    DBL: false,
    DLF: false
}