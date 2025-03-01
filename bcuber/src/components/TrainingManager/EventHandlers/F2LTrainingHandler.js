import { CubeTimer } from '../../cubeTimer.js'
import { CubeSolvingPhaseEventManager } from './CFOPPhaseManager.js'
import { CFOPCubeSolvingPhase } from './types.js'

/**
 *
 */
export class F2LPracticeEventHandler {
    /**
     * @param {object} options
     * @param {CubeTimer} options.timer
     * @param {() => Promise<{scramble: string; index: number}>} options.generateScramble - E.g. "333", "f2l", "cross", etc.
     */
    constructor(options) {
        this.timer = options.timer
        this.f2lIndex = 0;
        this._generateScramble = options.generateScramble
        this.cubeSolvingStateEventManager = new CubeSolvingPhaseEventManager(this.handleEvent.bind(this))

        /**
         * @type {((arg0: import('./types.js').CubeEvent) => {})[]}
         */
        this._eventSubscribers = []
    }

    /*
    * @returns Promise<string>
    */
    async generateScramble() {
        const {scramble, index}  = await this._generateScramble()
        this.f2lIndex = index;
        return scramble;
    }

    /**
     * @param {((arg0: import('./types.js').CubeEvent) => {})} callback
     */
    subscribeToEvents(callback) {
        this._eventSubscribers.push(callback)
    }

    /**
     * @param {(arg0: import('./types.js').CubeEvent) => {}} callback
     */
    unsubscribeFromEvents(callback) {
        this._eventSubscribers = this._eventSubscribers.filter(sub => sub !== callback)
    }

    handleSolvedEvent() {
        this.timer.saveCheckpoint()
    }

    /**
     * 
     * @param {import('./types.js').CubeEvent} event 
     */
    handleEvent(event) {
        if (event.name == CFOPCubeSolvingPhase.F2l_COMPLETE || event.name == CFOPCubeSolvingPhase.SOLVED) {
            this.timer.saveCheckpoint()
            for (let subscriber of this._eventSubscribers) {
                subscriber({
                    name: CFOPCubeSolvingPhase.SOLVED,
                    data: null
                })
            }
        }
    }


    /**
     * Processes incoming cube moves.
     * This method is a refactored version of your onCubeMove callback.
     * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x 
     */
    processCubeMove(x) {
        const { facelet } = x
        this.cubeSolvingStateEventManager.crossColor = "D"
        this.cubeSolvingStateEventManager.update(facelet)
    }

    reset() {
        this.f2lIndex = 0;
        this.cubeSolvingStateEventManager.reset()
        this.timer.resetTimer()
    }
}