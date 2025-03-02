import { CubeTimer } from "../../cubeTimer.js";
import { CubeSolvingPhaseEventManager } from "./CFOPPhaseManager.js";

/**
 * Abstract class for practice event handlers.
 */
export class AbstractPracticeEventHandler {
  /**
   * @param {object} options
   * @param {CubeTimer} options.timer
   */
  constructor(options) {
    if (new.target === AbstractPracticeEventHandler) {
      throw new TypeError(
        "Cannot construct AbstractPracticeEventHandler instances directly"
      );
    }
    this.timer = options.timer;
    this.cubeSolvingStateEventManager = new CubeSolvingPhaseEventManager(
      this.handleEvent.bind(this)
    );

    /**
     * @type {((arg0: import('./types.js').CubeEvent) => {})[]}
     */
    this._eventSubscribers = [];
  }

  /**
   * @param {((arg0: import('./types.js').CubeEvent) => {})} callback
   */
  subscribeToEvents(callback) {
    this._eventSubscribers.push(callback);
  }

  /**
   * @param {(arg0: import('./types.js').CubeEvent) => {}} callback
   */
  unsubscribeFromEvents(callback) {
    this._eventSubscribers = this._eventSubscribers.filter(
      (sub) => sub !== callback
    );
  }

  handleSolvedEvent() {
    this.timer.saveCheckpoint();
  }

  /**
   * Processes incoming cube moves.
   * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x
   */
  processCubeMove(x) {
    const { facelet } = x;
    this.cubeSolvingStateEventManager.update(facelet);
  }

  reset() {
    this.cubeSolvingStateEventManager.reset();
    this.timer.resetTimer();
  }

  /**
   * Abstract method to generate scramble.
   * @returns {Promise<string>}
   */
  generateScramble() {
    throw new Error("Method 'generateScramble()' must be implemented.");
  }

  /**
   * Abstract method to handle events.
   * @param {import('./types.js').CubeEvent} event
   */
  handleEvent(event) {
    throw new Error("Method 'handleEvent()' must be implemented.");
  }
}
