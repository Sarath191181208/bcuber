// @ts-check
import "./style.css";
import { RubiksCubeComponent } from "./components/render-cube.js";
import { QiYiCubeController } from "./components/qiyi/cubeController";
import { QIYI_CONFIG } from "./components/qiyi/config";
import { randomScrambleForEvent } from "cubing/scramble";
import { CubeTimer } from "./components/cubeTimer.js";
import { ScrambleHandler } from "./utils/scrambleHandler.js";
import { selectElement } from "./utils/domUtils.js";
import {
  BluetoothConnectedIcon,
  BluetoothConnectingIcon,
} from "./utils/icons.js";
import { SolveDataTable } from "./utils/solveData.js";
import { RecentSolveView } from "./components/recent-solve-view.js";
import {
  TrainingManager,
} from "./components/TrainingManager/TrainingManager.js";
import { CFOPPracticeEventHandler } from "./components/TrainingManager/EventHandlers/CFOPTrainingHandler.js";

const qiyiConnectButton = selectElement("#qiyi-connect-btn");
const cubeRenderDiv = selectElement("#cube");
const toggleGizmosButton = selectElement("#toggle-gizmos-btn");
const scrambleButton = selectElement("#scramble-button");
const scrambleDisplay = selectElement("#scramble-display");
const timerDisplay = selectElement("#timer-display");
const recentSolvedStatsView = selectElement("#recent-solve-view");
const autoTimerButton = selectElement("#auto-timer-btn");
const autoScrambleOnSolveButton = selectElement("#auto-scramble-on-solve-btn");
const historyTableContainer = selectElement("#solve-history-view");

const debugCubeContainer = document.querySelector("#debug-cube-container");

const NUM_SEGMENTS = 1 + 4 + 1 + 1;
const timer = new CubeTimer(NUM_SEGMENTS, timerDisplay);
const scrambleHandler = new ScrambleHandler(scrambleDisplay);
const historyHandler = new SolveDataTable(historyTableContainer);

console.log({ solve: historyHandler.solves[0] });
const recentSolvedViewHandler = new RecentSolveView(
  recentSolvedStatsView,
  historyHandler.solves[0]
);
recentSolvedViewHandler.render();

let turnInspectionOnAutomatically = false;

let autoScrambleOnSolve = false;

// Create the cube and controller instances
const cube = new RubiksCubeComponent(cubeRenderDiv);

const generateScramble = async () => {
  const x = await randomScrambleForEvent("333");
  return x.toString();
};
const trainingManager = new TrainingManager({
  practiceEventHandler: new CFOPPracticeEventHandler({
    timer,
    generateScramble,
  }),
  scrambleHandler,
  onSolve: (solve) => {
    historyHandler.addSolve(solve);
    recentSolvedViewHandler.solveData = solve;
    recentSolvedViewHandler.render();
  },
  autoScrambleOnSolve,
  turnInspectionOnAutomatically,
});

/**
 * Processes moves coming in from the cube.
 * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x
 */
const onCubeMove = (x) => {
  const { inputs, facelet } = x;
  // Combine moves from the event (sorted by timestamp)
  const inputMoveStr = inputs
    .sort((a, b) => a.cubeTimeStamp - b.cubeTimeStamp)
    .map((m) => m.move.trim().toUpperCase())
    .join(" ");

  // animate the cube
  cube.addMoves(inputMoveStr);

  // use training manager to update
  trainingManager.processCubeMove(x);
};

const qiyiHandler = new QiYiCubeController(
  QIYI_CONFIG,
  onCubeMove,
  // @ts-expect-error Element and HTML are almost the same therefore it's not an issue
  debugCubeContainer
);

// Start with gizmos active
let gizmosActive = false;
cube.toggleGizmos(gizmosActive);

// Connect QIYI Cube when the connect button is clicked
qiyiConnectButton.addEventListener("click", async () => {
  connectWithBluetooth();
});

// Toggle gizmos on/off and update the button's active class accordingly
toggleGizmosButton.addEventListener("click", () => {
  gizmosActive = !gizmosActive;
  cube.toggleGizmos(gizmosActive);
  toggleGizmosButton.classList.toggle("active", gizmosActive);
});

// Scramble the cube when the scramble button is clicked
scrambleButton.addEventListener("click", async () => {
  await trainingManager.scrambleCube();
});

// Toggle the auto timer on/off and update the button's active class accordingly
autoTimerButton.addEventListener("click", () => {
  toggleAutoTimer();
});

// Toggle the auto scramble on solve on/off and update the button's active class accordingly
autoScrambleOnSolveButton.addEventListener("click", () => {
  toggleAutoScrambleOnSolve();
});

const connectWithBluetooth = async () => {
  qiyiConnectButton.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`;
  const connected = await qiyiHandler.connectCube();
  if (connected) {
    qiyiConnectButton.innerHTML = /*html */ `<icon>${BluetoothConnectedIcon}</icon>`;
    await trainingManager.scrambleCube();
  } else {
    qiyiConnectButton.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`;
    qiyiConnectButton.style.border = "1px solid red";
  }
};

// on b connect with bluetooth
document.body.addEventListener("keydown", async (e) => {
  if (e.key === "b") {
    await connectWithBluetooth();
  }
});

const toggleAutoTimer = async () => {
  turnInspectionOnAutomatically = !turnInspectionOnAutomatically;
  trainingManager.setTurnInspectionOnAutomatically(
    turnInspectionOnAutomatically
  );
  if (turnInspectionOnAutomatically) {
    autoTimerButton.classList.add("active");
  } else {
    autoTimerButton.classList.remove("active");
  }
};

const toggleAutoScrambleOnSolve = () => {
  autoScrambleOnSolve = !autoScrambleOnSolve;
  trainingManager.setAutoScrambleOnSolve(autoScrambleOnSolve);
  if (autoScrambleOnSolve) {
    autoScrambleOnSolveButton.classList.add("active");
  } else {
    autoScrambleOnSolveButton.classList.remove("active");
  }
};

toggleAutoTimer(); // this is to set the initial state of the button
toggleAutoScrambleOnSolve(); // this is to set the initial state of the button
