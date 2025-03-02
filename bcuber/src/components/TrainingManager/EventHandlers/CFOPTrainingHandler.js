import { CubeTimer } from "../../cubeTimer.js";
import { AbstractPracticeEventHandler } from "./AbstractTrainingHandler.js";
import { CFOPCubeSolvingPhase } from "./types.js";

/**
 *
 */
export class CFOPPracticeEventHandler extends AbstractPracticeEventHandler {
  /**
   * @param {object} options
   * @param {CubeTimer} options.timer
   * @param {() => Promise<string>} options.generateScramble - E.g. "333", "f2l", "cross", etc.
   */
  constructor(options) {
    super(options);
    this.generateScramble = options.generateScramble;
  }
  /**
   *
   * @param {import('./types.js').CubeEvent} event
   */
  handleEvent(event) {
    if (event.name == CFOPCubeSolvingPhase.CROSS_SOLVED) {
      this.handleCrossSolveEvent(event.data.color);
    }
    if (event.name == CFOPCubeSolvingPhase.F2L_PROGRESS) {
      this.handleF2LSolveEvent(event.data.count, event.data.f2lSlots);
    }
    if (event.name == CFOPCubeSolvingPhase.OLL) {
      this.handleOLLCompleteEvent();
    }
    if (event.name == CFOPCubeSolvingPhase.SOLVED) {
      this.handleSolvedEvent();
    }

    for (const subscriber of this._eventSubscribers) {
      subscriber(event);
    }
  }

  /**
   * @param {string} _color
   */
  handleCrossSolveEvent(_color) {
    this.timer.saveCheckpoint();
  }

  /**
   * @param {number} _count
   * @param {import('../../../types.js').F2LIsSlotSolved} _f2lSlots
   */
  handleF2LSolveEvent(_count, _f2lSlots) {
    this.timer.saveCheckpoint();
  }

  handleOLLCompleteEvent() {
    this.timer.saveCheckpoint();
  }

}
