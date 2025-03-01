import { selectElement } from "./utils/domUtils";

const qiyiConnect = selectElement("#qiyi-connect-btn");
const cube = selectElement("#cube");
const toggleGizmos = selectElement("#toggle-gizmos-btn");
const scrambleBtn = selectElement("#scramble-button");
const scramble = selectElement("#scramble-display");
const timer = selectElement("#timer-display");
const recentSolved = selectElement("#recent-solve-view");
const history = selectElement("#solve-history-view");

const autoTimer = selectElement("#auto-timer-btn");
const autoScrambleOnSolve = selectElement("#auto-scramble-on-solve-btn");

const debugCube = document.querySelector("#debug-cube-container");

export const views = {
  timer,
  history,
  recentSolved,
  scramble,
  cube,
  debugCube,

  buttons: {
    qiyiConnect,
    toggleGizmos,
    scramble: scrambleBtn,
    autoTimer,
    autoScrambleOnSolve,
  },
};
