// @ts-check
import "./style.css";
import { RubiksCubeComponent } from "./components/render-cube.js";
import { QiYiCubeController } from "./components/qiyi/cubeController";
import { QIYI_CONFIG } from "./components/qiyi/config";
import {
  getTrainingManager,
  TrainingType,
} from "./utils/getTrainingManager.js";
import { views } from "./views.js";
import {
  connectWithBluetooth,
  setAutoScrambleOnSolve,
  setAutoInspection,
  setGizmos,
} from "./actions.js";
import { state } from "./state.js";
import { SelectOLLScreen } from "./components/oll-select.js";

// Create the cube and controller instances
const cube = new RubiksCubeComponent(views.cube);
const trainingType = TrainingType.OLL;
let trainingManager = getTrainingManager(trainingType, views);
document.addEventListener("DOMContentLoaded", function () {
    views.dropdowns.trainingSelect.dispatchEvent(new CustomEvent("value-select", { detail: trainingType }));
});

const ollSelect = new SelectOLLScreen(views.ollSelect);
ollSelect.render()

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
  views.debugCube
);

setAutoInspection(trainingManager, state.turnInspectionOnAutomatically);
setAutoScrambleOnSolve(trainingManager, state.autoScrambleOnSolve);
cube.toggleGizmos(state.gizmosActive);

// Connect QIYI Cube when the connect button is clicked
views.buttons.qiyiConnect.addEventListener("click", async () => {
  connectWithBluetooth(trainingManager, qiyiHandler);
});

// Scramble the cube when the scramble button is clicked
views.buttons.scramble.addEventListener("click", async () => {
  await trainingManager.scrambleCube();
});

// Toggle gizmos on/off and update the button's active class accordingly
views.buttons.toggleGizmos.addEventListener("click", () => {
  setGizmos(cube, !state.gizmosActive);
});

// Toggle the auto timer on/off and update the button's active class accordingly
views.buttons.autoTimer.addEventListener("click", () => {
  setAutoInspection(trainingManager, !state.turnInspectionOnAutomatically);
});

// Toggle the auto scramble on solve on/off and update the button's active class accordingly
views.buttons.autoScrambleOnSolve.addEventListener("click", () => {
  setAutoScrambleOnSolve(trainingManager, !state.autoScrambleOnSolve);
});

views.dropdowns.trainingSelect.addEventListener("value-select", (value) => {
  // @ts-expect-error this is a custom event and a valid value is passed
  const val = value.detail;
  if (val === "F2L") {
    trainingManager = getTrainingManager(TrainingType.F2L, views);
  } else if (val === "OLL") {
    trainingManager = getTrainingManager(TrainingType.OLL, views);
  } else if (val === "CFOP") {
    trainingManager = getTrainingManager(TrainingType.CFOP, views);
  } else {
    throw new Error("Invalid TrainingType");
  }
});
