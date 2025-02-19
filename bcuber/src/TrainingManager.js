import { CubeTimer } from './components/cubeTimer.js'
import { ScrambleHandler } from './utils/scrambleHandler.js'
import { SolveData } from './utils/solveData.js'
import { CubeState } from './types.js'
import { getF2LPairsSolved } from './components/stageFinder/faceleteF2lChecker.js'
import { getCrossSolvedColor } from './components/stageFinder/faceletCrossChecker.js'
import { getOLLSolved } from './components/stageFinder/faceletOllChecker.js'
import { Alg } from 'cubing/alg'

/**
 * TrainingManager manages the state for a training session.
 * It holds objects such as timer, scrambleHandler, and variables like trainingEventType,
 * auto scramble and inspection flags.
 */
export class TrainingManager {
    /**
     * @param {object} options
     * @param {CubeTimer} options.timer
     * @param {ScrambleHandler} options.scrambleHandler
     * @param {() => Promise<string>} options.generateScramble - E.g. "333", "f2l", "cross", etc.
     * @param {(arg0: SolveData) => void} options.onSolve
     * @param {boolean} [options.autoScrambleOnSolve]
     * @param {boolean} [options.turnInspectionOnAutomatically]
     */
    constructor(options) {
        this.timer = options.timer
        this.scrambleHandler = options.scrambleHandler
        this.generateScramble = options.generateScramble
        this.autoScrambleOnSolve = options.autoScrambleOnSolve || false
        this.turnInspectionOnAutomatically = options.turnInspectionOnAutomatically || false
        this.cubeSolvingStateEventManager = new CubeSolvingPhaseEventManager(this.handleEvent.bind(this))
        this.onSolve = options.onSolve

        this.solve = null
    }

    // Methods to update the managed objects/variables
    /**
     * @param {CubeTimer} timer
     */
    setTimer(timer) {
        this.timer = timer
    }
    /**
     * @param {ScrambleHandler} handler
     */
    setScrambleHandler(handler) {
        this.scrambleHandler = handler
    }
    /**
     * @param {() => Promise<string>} fn
     */
    setGenerateScramble(fn) {
        this.generateScramble = fn
    }
    /**
     * @param {boolean} flag
     */
    setAutoScrambleOnSolve(flag) {
        this.autoScrambleOnSolve = flag
    }
    /**
     * @param {boolean} flag
     */
    setTurnInspectionOnAutomatically(flag) {
        this.turnInspectionOnAutomatically = flag
    }

    /**
     * Generates a scramble using the current training event type.
     */
    async scrambleCube() {
        if (this.currentState !== CubeState.SCRAMBLING) {
            this.currentState = CubeState.SCRAMBLING
            const randScramble = await this.generateScramble()
            this.solve = new SolveData(randScramble.toString())
            this.scrambleHandler.setScramble(new Alg(randScramble))
            this.cubeSolvingStateEventManager.reset()
        }
    }

    handleSolveEvent() {
        this.currentState = CubeState.LIVE
        this.timer.saveCheckpoint()
        this.timer.stopTimer()

        // Clone solve data from timer
        this.solve?.cloneFromTimer(this.timer)
        if (this.solve) {
            this.onSolve(this.solve)
        } else {
            console.error("Solve data is null.")
            throw new Error("Solve data is null.")
        }

        // If auto-scramble is enabled, trigger a new scramble
        if (this.autoScrambleOnSolve) {
            this.scrambleCube()
        }
    }

    /**
     * @param {string} color
     */
    handleCrossSolveEvent(color) {
        this.timer.saveCheckpoint()
    }

    /**
     * @param {number} count
     * @param {import('./types.js').F2LIsSlotSolved} f2lSlots
     */
    handleF2LSolveEvent(count, f2lSlots) {
        this.timer.saveCheckpoint()
    }

    handleOLLCompleteEvent() {
        this.timer.saveCheckpoint()
    }

    /**
     * 
     * @param {CubeEvent} event 
     */
    handleEvent(event) {
        if (event.name == CFOPCubeSolvingPhase.CROSS_SOLVED) {
            this.handleCrossSolveEvent(event.data.color)
        }
        if (event.name == CFOPCubeSolvingPhase.F2L_PROGRESS) {
            this.handleF2LSolveEvent(event.data.count, event.data.f2lSlots)
        }
        if (event.name == CFOPCubeSolvingPhase.OLL) {
            this.handleOLLCompleteEvent()
        }
        if (event.name == CFOPCubeSolvingPhase.SOLVED) {
            this.handleSolveEvent()
        }
    }

    /**
     * Processes incoming cube moves.
     * This method is a refactored version of your onCubeMove callback.
     * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x 
     */
    processCubeMove(x) {
        const { inputs, facelet } = x
        const inputMoveStr = inputs
            .sort((a, b) => a.cubeTimeStamp - b.cubeTimeStamp)
            .map(m => m.move.trim().toUpperCase())
            .join(" ")

        if (this.currentState === CubeState.LIVE) {
            return
        }

        if (this.currentState === CubeState.SCRAMBLING_COMPLETE) {
            this.currentState = CubeState.SOLVING
            this.timer.startTimer()
            this.timer.resetInspectionTimer()
        }

        if (this.currentState === CubeState.SOLVING) {
            inputMoveStr.split(/\s+/).forEach(move => this.solve?.addMove(move))
            this.cubeSolvingStateEventManager.update(facelet)
        }

        if (this.currentState === CubeState.SCRAMBLING) {
            const moves = inputMoveStr.toUpperCase().trim().split(/\s+/)
            this.scrambleHandler.processMoves(moves)
            if (this.scrambleHandler.isScrambleComplete()) {
                this.currentState = CubeState.SCRAMBLING_COMPLETE
                this.scrambleHandler.reset()

                if (this.turnInspectionOnAutomatically) {
                    this.timer.startInspectionTimer(() => {
                        this.currentState = CubeState.SOLVING
                        this.timer.startTimer()
                    })
                }
            }
        }
    }
}

/**
 * @typedef {Object} CubeEvent
 * @property {string} name
 * @property {any} data
 */

// normal cfop events enum
/**
 * @enum {string}
 */
const CFOPCubeSolvingPhase = {
    SCRAMBLED: "SCRAMBLED",
    CROSS_SOLVED: "CROSS_SOLVED",
    F2L_PROGRESS: "F2L_PROGRESS",
    F2l_COMPLETE: "F2L_COMPLETE",
    OLL: "OLL",
    PLL: "PLL",
    SOLVED: "SOLVED"
}



class CubeSolvingPhaseEventManager {
    /**
     *  @param {function(CubeEvent): void} onEvent - The callback to be invoked when a new phase is reached.
     */
    constructor(onEvent) {
        this.currentPhase = CFOPCubeSolvingPhase.SCRAMBLED
        this.lastF2LCount = 0
        this.onEvent = onEvent
    }

    reset() {
        this.currentPhase = CFOPCubeSolvingPhase.SCRAMBLED
        this.lastF2LCount = 0
    }

    /**
     * @param {string} facelet - The cube's current facelet configuration.
     */
    update(facelet) {
        // If the cube is solved, fire the solved event.
        if (
            facelet ===
            'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
        ) {
            if (this.currentPhase !== CFOPCubeSolvingPhase.SOLVED) {
                this.currentPhase = CFOPCubeSolvingPhase.SOLVED
                this.onEvent({ name: CFOPCubeSolvingPhase.SOLVED, data: null })
            }
            return
        }

        // Check if the cross is solved.
        const crossColor = getCrossSolvedColor(facelet)
        if (this.currentPhase === CFOPCubeSolvingPhase.SCRAMBLED) {
            if (crossColor) {
                this.currentPhase = CFOPCubeSolvingPhase.CROSS_SOLVED
                this.onEvent({ name: CFOPCubeSolvingPhase.CROSS_SOLVED, data: { color: crossColor } })
            }
        }

        // Check F2L progress.
        // We consider F2L even if the current phase is CROSS (i.e. if F2L work has begun)
        if (
            this.currentPhase === CFOPCubeSolvingPhase.CROSS_SOLVED ||
            this.currentPhase === CFOPCubeSolvingPhase.F2L_PROGRESS
        ) {
            const f2lStatus = getF2LPairsSolved(facelet, crossColor)
            const newPairEvent = this.getF2LPairEvent(f2lStatus)
            if (newPairEvent) {
                this.onEvent({ name: CFOPCubeSolvingPhase.F2L_PROGRESS, data: { count: newPairEvent, f2lSlots: f2lStatus } })
            }
            if (newPairEvent === 4 && this.currentPhase !== CFOPCubeSolvingPhase.OLL) {
                this.currentPhase = CFOPCubeSolvingPhase.OLL
                this.onEvent({ name: CFOPCubeSolvingPhase.F2l_COMPLETE, data: null })
            }
        }

        // Check OLL.
        if (this.currentPhase === CFOPCubeSolvingPhase.OLL) {
            const ollSolved = getOLLSolved(facelet, crossColor)
            if (ollSolved) {
                this.currentPhase = CFOPCubeSolvingPhase.PLL
                this.onEvent({ name: CFOPCubeSolvingPhase.OLL, data: null })
            }
        }
    }

    /**
     * Determines a new F2L pair event.
     * @param {import('./types.js').F2LIsSlotSolved | null} f2lSolved 
     * @returns {number|undefined}
     */
    getF2LPairEvent(f2lSolved) {
        if (f2lSolved == null) return
        let prev = this.lastF2LCount ?? 0
        const res =
            +f2lSolved.DBL |
            (+f2lSolved.DFR) << 1 |
            (+f2lSolved.DLF) << 2 |
            (+f2lSolved.DRB) << 3
        const curr = res | prev
        this.lastF2LCount = curr
        if (this.countBin1(prev) === this.countBin1(curr)) return
        return this.countBin1(curr)
    }

    /**
     * @param {number} n
     */
    countBin1(n) {
        return n.toString(2).replace(/0/g, "").length
    }
}