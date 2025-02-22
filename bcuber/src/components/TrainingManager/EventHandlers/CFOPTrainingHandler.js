import { CubeTimer } from '../../cubeTimer.js'
import { CubeSolvingPhaseEventManager } from './CFOPPhaseManager.js'
import { CFOPCubeSolvingPhase } from './types.js'

/**
 *
 */
export class CFOPPracticeEventHandler {
  /**
   * @param {object} options
   * @param {CubeTimer} options.timer
   * @param {() => Promise<string>} options.generateScramble - E.g. "333", "f2l", "cross", etc.
   */
  constructor(options) {
    this.timer = options.timer
    this.generateScramble = options.generateScramble
    this.cubeSolvingStateEventManager = new CubeSolvingPhaseEventManager(this.handleEvent.bind(this))

    /**
     * @type {((arg0: import('./types.js').CubeEvent) => {})[]}
     */
    this._eventSubscribers = []
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
   * @param {string} _color
   */
  handleCrossSolveEvent(_color) {
    this.timer.saveCheckpoint()
  }

  /**
   * @param {number} _count
   * @param {import('../../../types.js').F2LIsSlotSolved} _f2lSlots
   */
  handleF2LSolveEvent(_count, _f2lSlots) {
    this.timer.saveCheckpoint()
  }

  handleOLLCompleteEvent() {
    this.timer.saveCheckpoint()
  }

  /**
   * 
   * @param {import('./types.js').CubeEvent} event 
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
      this.handleSolvedEvent()
    }

    for (const subscriber of this._eventSubscribers) {
      subscriber(event)
    }
  }


  /**
   * Processes incoming cube moves.
   * This method is a refactored version of your onCubeMove callback.
   * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x 
   */
  processCubeMove(x) {
    const { facelet } = x
    this.cubeSolvingStateEventManager.update(facelet)
  }

  reset() {
    this.cubeSolvingStateEventManager.reset()
    this.timer.resetTimer()
  }
}