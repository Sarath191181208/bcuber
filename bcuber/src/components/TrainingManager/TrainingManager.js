//@ts-check
import { CubeTimer } from "../cubeTimer.js";
import { ScrambleHandler } from "../../utils/scrambleHandler.js";
import { SolveData } from "../../utils/solveData.js";
import { CubeState } from "../../types.js";
import { Alg } from "cubing/alg";
import { CFOPPracticeEventHandler } from "./EventHandlers/CFOPTrainingHandler.js";
import { CFOPCubeSolvingPhase } from "./EventHandlers/types.js";
import { F2LPracticeEventHandler } from "./EventHandlers/F2LTrainingHandler.js";

/**
 * TrainingManager manages the state for a training session.
 * It holds objects such as timer, scrambleHandler, and variables like trainingEventType,
 * auto scramble and inspection flags.
 */
export class TrainingManager {
  /**
   * @param {object} options
   * @param {ScrambleHandler} options.scrambleHandler
   * @param {CFOPPracticeEventHandler | F2LPracticeEventHandler} options.practiceEventHandler
   * @param {(arg0: SolveData) => void} options.onSolve
   * @param {boolean?} [options.autoScrambleOnSolve]
   * @param {boolean?} [options.turnInspectionOnAutomatically]
   * @param {boolean?} [options.startTimerAutomatically]
   */
  constructor(options) {
    this.scrambleHandler = options.scrambleHandler;
    this.autoScrambleOnSolve = options.autoScrambleOnSolve || false;
    this.practiceEventHandler = options.practiceEventHandler;
    this.turnInspectionOnAutomatically =
      options.turnInspectionOnAutomatically || false;
    this.startTimerAutomatically = options.startTimerAutomatically || false;
    this.onSolve = options.onSolve;

    this.practiceEventHandler.subscribeToEvents(this.handleEvent.bind(this));

    this.solve = null;
  }

  // Methods to update the managed objects/variables
  /**
   * @param {CubeTimer} timer
   */
  setTimer(timer) {
    this.timer = timer;
  }
  /**
   * @param {ScrambleHandler} handler
   */
  setScrambleHandler(handler) {
    this.scrambleHandler = handler;
  }
  /**
   * @param {() => Promise<string>} fn
   */
  setGenerateScramble(fn) {
    this.generateScramble = fn;
  }
  /**
   * @param {boolean} flag
   */
  setAutoScrambleOnSolve(flag) {
    this.autoScrambleOnSolve = flag;
  }
  /**
   * @param {boolean} flag
   */
  setTurnInspectionOnAutomatically(flag) {
    this.turnInspectionOnAutomatically = flag;
  }
  /**
   * @param {boolean} flag
   */
  setStartTimerAutomatically(flag) {
    this.startTimerAutomatically = flag;
  }

  /**
   * Generates a scramble using the current training event type.
   */
  async scrambleCube() {
    if (this.currentState !== CubeState.SCRAMBLING) {
      this.currentState = CubeState.SCRAMBLING;
      const randScramble = await this.practiceEventHandler.generateScramble();
      this.solve = new SolveData(randScramble.toString());
      this.scrambleHandler.setScramble(new Alg(randScramble));
      this.practiceEventHandler.cubeSolvingStateEventManager.reset();
    }
  }

  handleSolveEvent() {
    this.currentState = CubeState.LIVE;
    this.practiceEventHandler.timer.stopTimer();

    // Clone solve data from timer
    this.solve?.cloneFromTimer(this.practiceEventHandler.timer);
    if (this.solve) {
      this.onSolve(this.solve);
    } else {
      console.error("Solve data is null.");
      throw new Error("Solve data is null.");
    }

    // If auto-scramble is enabled, trigger a new scramble
    if (this.autoScrambleOnSolve) {
      this.scrambleCube();
    }
  }
  /**
   *
   * @param {import('./EventHandlers/types.js').CubeEvent} event
   */
  handleEvent(event) {
    if (event.name == CFOPCubeSolvingPhase.SOLVED) {
      this.handleSolveEvent();
    }
  }

  /**
   * Processes incoming cube moves.
   * This method is a refactored version of your onCubeMove callback.
   * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x
   */
  processCubeMove(x) {
    const { inputs } = x;
    const inputMoveStr = inputs
      .sort((a, b) => a.cubeTimeStamp - b.cubeTimeStamp)
      .map((m) => m.move.trim().toUpperCase())
      .join(" ");

    if (this.currentState === CubeState.LIVE) {
      return;
    }

    if (this.currentState === CubeState.WAITING) {
      this.currentState = CubeState.SOLVING;
      this.practiceEventHandler.timer.startTimer();
      this.practiceEventHandler.timer.resetInspectionTimer();
    }

    if (this.currentState === CubeState.SOLVING) {
      inputMoveStr.split(/\s+/).forEach((move) => this.solve?.addMove(move));
      this.practiceEventHandler.processCubeMove(x);
    }

    if (this.currentState === CubeState.SCRAMBLING) {
      const moves = inputMoveStr.toUpperCase().trim().split(/\s+/);
      this.scrambleHandler.processMoves(moves);
      if (this.scrambleHandler.isScrambleComplete()) {
        this.currentState = CubeState.SCRAMBLING_COMPLETE;
        this.scrambleHandler.reset();

        if (this.turnInspectionOnAutomatically) {
          this.practiceEventHandler.timer.startInspectionTimer(() => {
            this.currentState = CubeState.SOLVING;
            this.practiceEventHandler.timer.startTimer();
          });
        }
      }
    }

    if (this.currentState === CubeState.SCRAMBLING_COMPLETE) {
      if (this.startTimerAutomatically) {
        this.currentState = CubeState.SOLVING;
        this.practiceEventHandler.timer.startTimer();
        this.practiceEventHandler.timer.resetInspectionTimer();
      } else {
        this.currentState = CubeState.WAITING;
      }
    }
  }
}
