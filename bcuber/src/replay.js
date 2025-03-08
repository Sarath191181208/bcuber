//@ts-check
import { RubiksCubeComponent } from "./components/render-cube.js";
import { SolveDataTable } from "./utils/solveData.js";
import { selectElement } from "./utils/domUtils.js";
import { getInverse } from "./utils/moveUitls.js";

let selectedSolveIndex = null;

const historyHandler = new SolveDataTable(document.createElement("div"));
historyHandler.solves = historyHandler.storage.loadSolves();

const solveCardsContainer = selectElement("#solveCards");
const cubeContainer = selectElement("#cubeContainer");
const moveContainer = selectElement("#moveCounter");
const moveList = selectElement("#moveList");
const replaySolveButton = selectElement("#replaySolveButton");
const nextMoveButton = selectElement("#nextMoveButton");
const prevMoveButton = selectElement("#prevMoveButton");

historyHandler.solves.forEach((s) => {
  if (!s.startTime) {
    throw new Error("Start time is null");
  }
});

// @ts-ignore
const solves = historyHandler.solves.sort((a, b) => b.startTime - a.startTime);

function renderSolveHistory() {
  solveCardsContainer.innerHTML = solves.length
    ? solves
        .map(
          (s, i) => `
          <div class="solve-card" data-index="${i}">
            <div class="card-header"><h3>${new Date(
              s.startTime
            ).toLocaleString()}</h3></div>
            <div class="card-body">
              <p><strong>Time:</strong> ${(
                (s.endTime - s.startTime) /
                1000
              ).toFixed(2)}s</p>
              <p><strong>Moves:</strong> ${s.moves.length}</p>
            </div>
          </div>`
        )
        .join("")
    : '<p class="no-solves">No solves yet.</p>';

  document.querySelectorAll(".solve-card").forEach((card, i) =>
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".solve-card")
        .forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      const idx = card.getAttribute("data-index");
      if (idx == null) {
        throw new Error("Index is null");
      }
      selectedSolveIndex = parseInt(idx);
      updateMoveCounter();
    })
  );
}
renderSolveHistory();

const cube = new RubiksCubeComponent(cubeContainer);
let currentMoveIndex = 0;

function getSolutionMoves() {
  const solve = historyHandler.solves[selectedSolveIndex];
  const allmovesArr = solve.getCheckpointSegmentsMoves();
  const crossMoves = allmovesArr[0].replace(/s+/g, " ");
  const f2lMoves =
    `${allmovesArr[1]}  ${allmovesArr[2]}  ${allmovesArr[3]}  ${allmovesArr[4]}`.replace(
      /s+/g,
      " "
    );
  const ollMoves = allmovesArr[5].replace(/s+/g, " ");
  const pllMoves = allmovesArr[6].replace(/s+/g, " ");
  return {
    cross: crossMoves.split(" "),
    f2l: f2lMoves.split(" "),
    oll: ollMoves.split(" "),
    pll: pllMoves.split(" "),
  };
}

function updateMoveCounter() {
  if (selectedSolveIndex == null) return;

  let { cross, f2l, oll, pll } = getSolutionMoves();
  let allMoves = [...cross, ...f2l, ...oll, ...pll];

  const crossMoves = cross.length;
  const f2lMoves = f2l.length + crossMoves;
  const ollMoves = oll.length + f2lMoves;

  moveContainer.textContent = `Move: ${currentMoveIndex} / ${allMoves.length}`;

  moveList.innerHTML = `
        <h3>Cross</h3> ${cross
          .map(
            (m, i) =>
              `<span class="move-pill ${
                i < currentMoveIndex ? "completed" : ""
              }">${m}</span>`
          )
          .join("")}
        <h3>F2L</h3> ${f2l
          .map(
            (m, i) =>
              `<span class="move-pill ${
                crossMoves + i < currentMoveIndex ? "completed" : ""
              }">${m}</span>`
          )
          .join("")}
        <h3>OLL</h3> ${oll
          .map(
            (m, i) =>
              `<span class="move-pill ${
                f2lMoves + i < currentMoveIndex ? "completed" : ""
              }">${m}</span>`
          )
          .join("")}
        <h3>PLL</h3> ${pll
          .map(
            (m, i) =>
              `<span class="move-pill ${
                ollMoves + i < currentMoveIndex ? "completed" : ""
              }">${m}</span>`
          )
          .join("")}
    `;
}

replaySolveButton.addEventListener("click", () => {
  if (selectedSolveIndex == null) {
    alert("No Current Solve, please select one first");
    return;
  }
  const currentSolve = historyHandler.solves[selectedSolveIndex];
  cube.addMoves(currentSolve.scramble);
  currentMoveIndex = 0;
  updateMoveCounter();
});

nextMoveButton.addEventListener("click", () => {
  let { cross, f2l, oll, pll } = getSolutionMoves();
  let allMoves = [...cross, ...f2l, ...oll, ...pll];
  console.log("[All Moves]: ", allMoves);
  if (currentMoveIndex < allMoves.length)
    cube.addMoves(allMoves[currentMoveIndex++]);
  updateMoveCounter();
});

prevMoveButton.addEventListener("click", () => {
  let { cross, f2l, oll, pll } = getSolutionMoves();
  let allMoves = [...cross, ...f2l, ...oll, ...pll];

  if (currentMoveIndex > 0) {
    const move = allMoves[currentMoveIndex].toString();
    const reverseMove = getInverse(move);
    cube.addMoves(reverseMove);
    currentMoveIndex--;
  }
  updateMoveCounter();
});
