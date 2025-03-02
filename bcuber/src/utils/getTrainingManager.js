//@ts-check

import { randomScrambleForEvent } from "cubing/scramble";
import { CubeTimer } from "../components/cubeTimer";
import { CFOPPracticeEventHandler } from "../components/TrainingManager/EventHandlers/CFOPTrainingHandler";
import { SolveData, SolveDataTable } from "./solveData";
import { TrainingManager } from "../components/TrainingManager/TrainingManager";
import { ScrambleHandler } from "./scrambleHandler";
import {
  SinglePhaseRecentSolveView,
  RecentSolveView,
} from "../components/recent-solve-view";
import { normalizeRotationsInMoves } from "../components/moveNormalizeRotation";
import { F2L_ALGS } from "../algs/F2L_ALGS";
import { Alg } from "cubing/alg";
import { F2LPracticeEventHandler } from "../components/TrainingManager/EventHandlers/F2LTrainingHandler";
import { OLLPracticeEventHandler } from "../components/TrainingManager/EventHandlers/OLLTrainingHanlder";
import { OLL_ALGS } from "../algs/OLL_ALGS";

const generateNormalizedScramble = async (allAlgs) => {
  const { algs, index } = getRandomALG(allAlgs);
  const nrom = algs[0]
    .replaceAll(")", " ")
    .replaceAll("(", " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .split(" ");
  const alg = normalizeRotationsInMoves(nrom);
  console.log("RAND ALG: ", { alg, nrom });
  const randScramble = new Alg(alg.join(" ").replaceAll(/\s+/g, " "))
    .experimentalSimplify({
      cancel: true,
    })
    .invert();
  //   anything matching something like U2' or U2 will be replaced with U2
  const scramble = randScramble.toString().replaceAll(/([UDFBRL])2'/g, "$12");
  return { scramble, index };
};

/**
 * @param {Object[]} algs
 * @param {string[]} algs[].moves
 * @returns {{algs: string[], index: number}}
 */
function getRandomALG(algs) {
  const randIdx = Math.floor(Math.random() * algs.length);
  const randomALGList = algs[randIdx];
  console.log({ randomALGList });
  const filteredALGS = randomALGList.moves.filter((move) =>
    ["M", "S", "E", "d", "u", "rw", "dw", "f"].every((el) => !move.includes(el))
  );
  console.log({ filteredALGS });
  if (filteredALGS.length === 0) {
    return getRandomALG(algs);
  }
  return { algs: filteredALGS, index: randIdx };
}

/**
 * @enum {string}
 */
export const TrainingType = {
  CFOP: "CFOP",
  F2L: "F2L",
  OLL: "OLL",
};

/**
 * @param {TrainingType} type
 * @param {Object} views
 * @param {HTMLElement} views.timer
 * @param {HTMLElement} views.history
 * @param {HTMLElement} views.recentSolved
 * @param {HTMLElement} views.scramble
 */
export function getTrainingManager(type, views) {
  const scrambleHandler = new ScrambleHandler(views.scramble);
  const historyHandler = new SolveDataTable(views.history);

  let practiceEventHandler;
  let onSolve;
  let startTimerAutomatically = false;

  if (type == TrainingType.CFOP) {
    const NUM_SEGMENTS = 1 + 4 + 1 + 1;
    const timer = new CubeTimer(NUM_SEGMENTS, views.timer);

    practiceEventHandler = new CFOPPracticeEventHandler({
      timer,
      generateScramble,
    });

    const recentSolvedViewHandler = new RecentSolveView(
      views.recentSolved,
      historyHandler.solves[0]
    );
    recentSolvedViewHandler.render();

    onSolve = (/** @type {SolveData} */ solve) => {
      historyHandler.addSolve(solve);
      recentSolvedViewHandler.solveData = solve;
      recentSolvedViewHandler.render();
    };
  }

  if (type == TrainingType.F2L) {
    const timer = new CubeTimer(1, views.timer);
    practiceEventHandler = new F2LPracticeEventHandler({
      timer,
      generateScramble: () => generateNormalizedScramble(F2L_ALGS),
    });
    const f2LRecentSolveView = new SinglePhaseRecentSolveView(
      views.recentSolved,
      historyHandler.solves[0]
    );
    f2LRecentSolveView.render(F2L_ALGS[0].moves);

    onSolve = (/** @type {SolveData} */ solve) => {
      f2LRecentSolveView.solveData = solve;
      f2LRecentSolveView.render(F2L_ALGS[practiceEventHandler.f2lIndex].moves);
    };

    startTimerAutomatically = true;
  }

  if (type == TrainingType.OLL) {
    const timer = new CubeTimer(1, views.timer);
    const c = new OLLPracticeEventHandler({
      timer,
      generateScramble: () => generateNormalizedScramble(OLL_ALGS),
    });
    practiceEventHandler = c;
    const OLLRecentSolveView = new SinglePhaseRecentSolveView(
      views.recentSolved,
      historyHandler.solves[0]
    );
    OLLRecentSolveView.render(OLL_ALGS[0].moves);

    onSolve = (/** @type {SolveData} */ solve) => {
      OLLRecentSolveView.solveData = solve;
      OLLRecentSolveView.render(OLL_ALGS[c.OLLIndex].moves);
    };

    startTimerAutomatically = true;
  }

  if (practiceEventHandler == undefined || onSolve == undefined) {
    throw new Error("Invalid TrainingType");
  }

  return new TrainingManager({
    practiceEventHandler: practiceEventHandler,
    scrambleHandler,
    onSolve: onSolve,
    autoScrambleOnSolve: true,
    turnInspectionOnAutomatically: true,
    startTimerAutomatically: startTimerAutomatically,
  });
}

async function generateScramble() {
  const x = await randomScrambleForEvent("333");
  return x.toString();
}
