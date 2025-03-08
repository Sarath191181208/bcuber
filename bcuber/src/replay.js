//@ts-check
import { RubiksCubeComponent } from "./components/render-cube.js";
import { SolveDataTable } from "./utils/solveData.js";
import { getInverse } from "./utils/moveUitls.js";
import { views } from "./views/replay.js";
import { Alg } from "cubing/alg";

let selectedSolveIndex = null;

const historyHandler = new SolveDataTable(document.createElement("div"));
historyHandler.solves = historyHandler.storage.loadSolves();

historyHandler.solves.forEach((s) => {
  if (!s.startTime) {
    throw new Error("Start time is null");
  }
});

// @ts-ignore
const solves = historyHandler.solves.sort((a, b) => b.startTime - a.startTime);

function renderSolveHistory() {
  views.solveCardsContainer.innerHTML = solves.length
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
      // reset the cube
      cube = new RubiksCubeComponent(views.cubeContainer);
      selectedSolveIndex = parseInt(idx);
      const currentSolve = historyHandler.solves[selectedSolveIndex];
      cube.addMoves(currentSolve.scramble);
      currentMoveIndex = 0;
      renderMoveList();
      renderMoveList();
    })
  );
}
renderSolveHistory();

let cube = new RubiksCubeComponent(views.cubeContainer);
let currentMoveIndex = 0;

function getSolutionMoves() {
  const solve = historyHandler.solves[selectedSolveIndex];
  const allmovesArr = solve.getCheckpointSegmentsMoves();
  const crossMoves = allmovesArr[0].replace(/\s+/g, " ");
  const f2lMoves =
    `${allmovesArr[1]}  ${allmovesArr[2]}  ${allmovesArr[3]}  ${allmovesArr[4]}`.replace(
      /\s+/g,
      " "
    );
  const ollMoves = allmovesArr[5].replace(/\s+/g, " ");
  const pllMoves = allmovesArr[6].replace(/\s+/g, " ");
  return {
    cross: crossMoves.split(" "),
    f2l: f2lMoves.split(" "),
    oll: ollMoves.split(" "),
    pll: pllMoves.split(" "),
  };
}

function renderMoveList() {
  if (selectedSolveIndex == null) return;

  let { cross, f2l, oll, pll } = getSolutionMoves();
  let allMoves = [...cross, ...f2l, ...oll, ...pll];

  const crossMoves = cross.length;
  const f2lMoves = f2l.length + crossMoves;
  const ollMoves = oll.length + f2lMoves;

  views.moveContainer.textContent = `Move: ${currentMoveIndex} / ${allMoves.length}`;

  const createMovePills = (moves, offset) =>
    moves
      .map(
        (m, i) => `
        <span class="move-pill ${
          offset + i < currentMoveIndex ? "completed" : ""
        }" 
              data-index="${offset + i}">
          ${m}
        </span>
      `
      )
      .join("");

  views.moveList.innerHTML = `
    <div class="move-list-header">
        <h3>Cross</h3>
        <div class="move-pill-container">
            ${createMovePills(cross, 0)}
        </div>
    </div>
    <div class="move-list-header">
        <h3>F2L</h3>
        <div class="move-pill-container">
            ${createMovePills(f2l, crossMoves)}
        </div>
    </div>
    <div class="move-list-header">
        <h3>OLL</h3>
        <div class="move-pill-container">
            ${createMovePills(oll, f2lMoves)}
        </div>
    </div>
    <div class="move-list-header">
        <h3>PLL</h3>
        <div class="move-pill-container">
            ${createMovePills(pll, ollMoves)}
        </div>
    </div>
  `;

  document.querySelectorAll(".move-pill").forEach((pill) =>
    pill.addEventListener("click", (event) => {
      let moveIndex = parseInt(event.target.getAttribute("data-index"));
      if (isNaN(moveIndex)) {
        alert(
          "Invalid move index, this shouldn't have happend. Please report this issue."
        );
        return;
      }
      const isReverse = moveIndex < currentMoveIndex;
      let moves = [];
      if (isReverse) {
        moves = allMoves.slice(moveIndex, currentMoveIndex);
        const alg = new Alg(moves.join(" ").replace(/\s+/g, " "));
        moves = alg.invert().toString().split(" ");
        currentMoveIndex = moveIndex;
      } else {
        moves = allMoves.slice(currentMoveIndex, moveIndex + 1);
        currentMoveIndex = moveIndex + 1;
      }
      console.log("[Move Index]: ", {
        moveIndex,
        currentMoveIndex,
        moves,
        isReverse,
      });
      cube.addMoves(moves.join(" "));
      renderMoveList();
    })
  );
}

views.buttons.nextMove.addEventListener("click", () => {
  let { cross, f2l, oll, pll } = getSolutionMoves();
  let allMoves = [...cross, ...f2l, ...oll, ...pll];
  console.log("[All Moves]: ", allMoves);
  if (currentMoveIndex < allMoves.length)
    cube.addMoves(allMoves[currentMoveIndex++]);
  renderMoveList();
});

views.buttons.prevMove.addEventListener("click", () => {
  let { cross, f2l, oll, pll } = getSolutionMoves();
  let allMoves = [...cross, ...f2l, ...oll, ...pll];

  if (currentMoveIndex > 0) {
    const move = allMoves[currentMoveIndex-1].toString();
    const reverseMove = new Alg(move).invert().toString();
    console.log("[Reverse Move]: ", reverseMove);
    cube.addMoves(reverseMove);
    currentMoveIndex--;
  }
  renderMoveList();
});
