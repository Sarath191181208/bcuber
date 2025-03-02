import { CubeTimer } from "../../cubeTimer.js";
import { AbstractPracticeEventHandler } from "./AbstractTrainingHandler.js";
import { CFOPCubeSolvingPhase } from "./types.js";

export class OLLPracticeEventHandler extends AbstractPracticeEventHandler {
  /**
   * @param {object} options
   * @param {CubeTimer} options.timer
   * @param {() => Promise<{scramble: string; index: number}>} options.generateScramble - E.g. "333", "f2l", "cross", etc.
   */
  constructor(options) {
    super(options);
    this.OLLIndex = 0;
    this._generateScramble = options.generateScramble;
  }

  /**
   * @returns Promise<string>
   */
  async generateScramble() {
    const { scramble, index } = await this._generateScramble();
    this.OLLIndex = index;
    return scramble;
  }

  /**
   * @param {import('./types.js').CubeEvent} event
   */
  handleEvent(event) {
    if (
      event.name == CFOPCubeSolvingPhase.OLL ||
      event.name == CFOPCubeSolvingPhase.SOLVED
    ) {
      this.timer.saveCheckpoint();
      for (let subscriber of this._eventSubscribers) {
        subscriber({
          name: CFOPCubeSolvingPhase.SOLVED,
          data: null,
        });
      }
    }
  }

  /**
   * Processes incoming cube moves.
   * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x
   */
  processCubeMove(x) {
    this.cubeSolvingStateEventManager.crossColor = "D";
    super.processCubeMove(x);
  }

  reset() {
    super.reset();
    this.OLLIndex = 0;
  }
}
