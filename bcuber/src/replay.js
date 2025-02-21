
//@ts-check
import { RubiksCubeComponent } from './components/render-cube.js';
import { SolveDataTable } from './utils/solveData.js';
import { selectElement } from './utils/domUtils.js'
import { getInverse } from './utils/moveUitls.js';

let selectedSolveIndex = null;

const historyHandler = new SolveDataTable(document.createElement('div'));
historyHandler.solves = historyHandler.storage.loadSolves();

const solveCardsContainer = selectElement('#solveCards');
const cubeContainer = selectElement('#cubeContainer')
const moveContainer = selectElement('#moveCounter')
const moveList = selectElement('#moveList')
const replaySolveButton = selectElement('#replaySolveButton')
const nextMoveButton = selectElement('#nextMoveButton')
const prevMoveButton = selectElement('#prevMoveButton')

historyHandler.solves.forEach(s => {
    if (!s.startTime) {
        throw new Error('Start time is null');
    }
});

// @ts-ignore
const solves = historyHandler.solves.sort((a, b) => b.startTime - a.startTime);

function renderSolveHistory() {
    solveCardsContainer.innerHTML = solves.length
        ? solves.map((s, i) => `
          <div class="solve-card" data-index="${i}">
            <div class="card-header"><h3>${new Date(s.startTime).toLocaleString()}</h3></div>
            <div class="card-body">
              <p><strong>Time:</strong> ${((s.endTime - s.startTime) / 1000).toFixed(2)}s</p>
              <p><strong>Moves:</strong> ${s.moves.length}</p>
            </div>
          </div>`).join('')
        : '<p class="no-solves">No solves yet.</p>';

    document.querySelectorAll('.solve-card').forEach((card, i) =>
        card.addEventListener('click', () => {
            document.querySelectorAll('.solve-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const idx = card.getAttribute('data-index')
            if (idx == null) {
                throw new Error('Index is null');
            }
            selectedSolveIndex = parseInt(idx);
        })
    );
}
renderSolveHistory();

const cube = new RubiksCubeComponent(cubeContainer);
let currentMoveIndex = 0, solutionMoves = [];

function getSolutionMoves() {
    const moves = historyHandler.solves[selectedSolveIndex].moves
    const solutionMoves = moves.map(m => m.move);
    return solutionMoves;
}

function updateMoveCounter() {
    const solutionMoves = getSolutionMoves();
    moveContainer.textContent = `Move: ${currentMoveIndex} / ${solutionMoves.length}`;
    moveList.innerHTML = solutionMoves.map((m, i) =>
        `<span class="move-pill ${i < currentMoveIndex ? 'completed' : ''}">${m}</span>`).join('');
}

replaySolveButton.addEventListener('click', () => {
    if (selectedSolveIndex == null) {
        alert("No Current Solve, please select one first");
        return;
    }
    const currentSolve = historyHandler.solves[selectedSolveIndex]
    cube.addMoves(currentSolve.scramble)
    currentMoveIndex = 0;
    updateMoveCounter();
});

nextMoveButton.addEventListener('click', () => {
    let solutionMoves = getSolutionMoves();
    if (currentMoveIndex < solutionMoves.length) cube.addMoves(solutionMoves[currentMoveIndex++]);
    updateMoveCounter();
});

prevMoveButton.addEventListener('click', () => { 
    let solutionMoves = getSolutionMoves();
    if (currentMoveIndex > 0) {
        const move = solutionMoves[currentMoveIndex];
        const reverseMove = getInverse(move);
        cube.addMoves(reverseMove);
        currentMoveIndex--
    }
    updateMoveCounter();
});
