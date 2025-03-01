//@ts-check

import { QiYiCubeController } from "./components/qiyi/cubeController";
import { TrainingManager } from "./components/TrainingManager/TrainingManager";
import { state } from "./state";
import { BluetoothConnectedIcon, BluetoothConnectingIcon } from "./utils/icons";
import { views } from "./views";

/**
 * @param {TrainingManager} trainingManager
 * @param {boolean} value
 */
export const setAutoInspection = async (trainingManager, value) => {
  state.turnInspectionOnAutomatically = value;
  trainingManager.setTurnInspectionOnAutomatically(
    state.turnInspectionOnAutomatically
  );
  if (state.turnInspectionOnAutomatically) {
    views.buttons.autoTimer.classList.add("active");
  } else {
    views.buttons.autoTimer.classList.remove("active");
  }
};

/**
 * @param {TrainingManager} trainingManager
 * @param {boolean} value
 */
export const setAutoScrambleOnSolve = (trainingManager, value) => {
  state.autoScrambleOnSolve = value;
  trainingManager.setAutoScrambleOnSolve(state.autoScrambleOnSolve);
  if (state.autoScrambleOnSolve) {
    views.buttons.autoScrambleOnSolve.classList.add("active");
  } else {
    views.buttons.autoScrambleOnSolve.classList.remove("active");
  }
};

/**
 * @param {import("./components/render-cube").RubiksCubeComponent} cube
 * @param {boolean} value
*/
export const setGizmos = (cube, value) => {
  state.gizmosActive = value;
  cube.toggleGizmos(state.gizmosActive);
  views.buttons.toggleGizmos.classList.toggle("active", state.gizmosActive);
};

/**
 * @param {TrainingManager} trainingManager
 * @param {QiYiCubeController} qiyiHandler
 */
export const connectWithBluetooth = async (trainingManager, qiyiHandler) => {
  views.buttons.qiyiConnect.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`;
  const connected = await qiyiHandler.connectCube();
  if (connected) {
    views.buttons.qiyiConnect.innerHTML = /*html */ `<icon>${BluetoothConnectedIcon}</icon>`;
    await trainingManager.scrambleCube();
  } else {
    views.buttons.qiyiConnect.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`;
    views.buttons.qiyiConnect.style.border = "1px solid red";
  }
};
