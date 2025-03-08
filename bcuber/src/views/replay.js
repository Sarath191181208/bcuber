import { selectElement } from "../utils/domUtils.js";

export const views = {
  solveCardsContainer: selectElement("#solveCards"),
  cubeContainer: selectElement("#cubeContainer"),
  moveContainer: selectElement("#moveCounter"),
  moveList: selectElement("#moveList"),

  buttons: {
    nextMove: selectElement("#nextMoveButton"),
    prevMove: selectElement("#prevMoveButton"),
  },
};
