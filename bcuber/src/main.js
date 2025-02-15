import './style.css'
import { RubiksCubeComponent } from './components/render-cube.js'
import { QiYiCubeController } from './components/qiyi/cubeController'
import { QIYI_CONFIG } from './components/qiyi/config'
import { randomScrambleForEvent } from 'cubing/scramble'
import { CubeTimer } from './components/cubeTimer.js'
import { getF2LPairsSolved } from './components/stageFinder/faceleteF2lChecker.js'
import { getCrossSolvedColor } from './components/stageFinder/faceletCrossChecker.js'
import { getOLLSolved } from './components/stageFinder/faceletOllChecker.js'
import { ScrambleHandler } from './utils/scrambleHandler.js'
import { selectElement } from './utils/domUtils.js'
import { CubeSolvingStateEnum, CubeState } from './types.js'
import { BluetoothConnectedIcon, BluetoothConnectingIcon } from './utils/icons.js'
import { SolveData, SolveDataTable } from './utils/solveData.js'

const qiyiConnectButton = selectElement('#qiyi-connect-btn')
const cubeRenderDiv = selectElement('#cube')
const toggleGizmosButton = selectElement('#toggle-gizmos-btn')
const scrambleButton = selectElement('#scramble-button')
const scrambleDisplay = selectElement('#scramble-display')
const timerDisplay = selectElement('#timer-display')
const checkpointDisplay = selectElement('#checkpoint-view')
const historyTableContainer = selectElement('#solve-history-view')

const debugCubeContainer = document.querySelector('#debug-cube-container')


const timer = new CubeTimer(timerDisplay)
const scrambleHandler = new ScrambleHandler(scrambleDisplay);
/**
* @type {SolveData | null}
*/
let solve = null;
const historyHandler = new SolveDataTable(historyTableContainer)

/**
 * @type {CubeState}
 */
let currentState = CubeState.LIVE

/**
 * @type {import('./types.js').CubeSolvingState}
 */
let cubeSolvingState = {
  color: null,
  state: null,
  misc: {
    f2lSolved: null
  },
}

// Create the cube and controller instances
const cube = new RubiksCubeComponent(cubeRenderDiv)
// @ts-ignore
const qiyiHandler = new QiYiCubeController(QIYI_CONFIG, onCubeMove, debugCubeContainer)


/**
 * Processes moves coming in from the cube.
 * If in LIVE mode, it simply adds the move.
 * If in SCRAMBLING mode, it compares the normalized move with the expected scramble move.
 * - If correct, it "greys out" that move (updates scrambleIdx & UI).
 * - If incorrect, it computes the inverse move to undo the change.
 * @param {{inputs: {cubeTimeStamp: number, move: string}[], facelet: string}} x
 */
function onCubeMove(x) {
  const { inputs, facelet } = x
  // Combine moves from the event (sorted by timestamp)
  const inputMoveStr = inputs
    .sort((a, b) => a.cubeTimeStamp - b.cubeTimeStamp)
    .map(m => m.move.trim().toUpperCase())
    .join(" ")

  // animate the cube 
  cube.addMoves(inputMoveStr)

  // add the move to the solve data for saving
  inputMoveStr.split(/\s+/).forEach(move => solve?.addMove(move))

  if (currentState === CubeState.LIVE) {
    return
  }

  if (currentState === CubeState.SOLVING) {
    // show the timer checkpoitns 
    const buildCheckpoint = (data) => /*html*/ `<div>${data}</div>`
    checkpointDisplay.innerHTML = timer.getCheckpointSegments().map(buildCheckpoint).join("")

    // use facelet to decide the state of the cube
    // if the facelet is solved, then the cube is solved
    if (facelet === "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB") {
      currentState = CubeState.LIVE
      cubeSolvingState.state = CubeState.SOLVED
      cubeSolvingState.color = null
      cubeSolvingState.misc = { f2lSolved: null }
      timer.saveCheckpoint()
      timer.stopTimer()

      // add the solve to the history
      solve?.cloneFromTimer(timer)
      historyHandler.addSolve(solve)
      solve = null
      historyHandler.render()
    }

    // check if the cross is done 
    const solvedCrossColor = getCrossSolvedColor(facelet)
    if (solvedCrossColor != null && cubeSolvingState.state === CubeSolvingStateEnum.SCRAMBLED) {
      cubeSolvingState.state = CubeSolvingStateEnum.CROSS_SOLVED
      cubeSolvingState.color = solvedCrossColor
      timer.saveCheckpoint()
    }

    if (cubeSolvingState.state === CubeSolvingStateEnum.CROSS_SOLVED) {
      cubeSolvingState.state = CubeSolvingStateEnum.F2L
    }

    if (cubeSolvingState.state === CubeSolvingStateEnum.F2L) {
      const f2lsolved = getF2LPairsSolved(facelet, cubeSolvingState.color)
      const newPairEvent = getF2LPairEvent(f2lsolved)
      if (newPairEvent) {
        timer.saveCheckpoint()
      }
      if (newPairEvent == 4) {
        cubeSolvingState.state = CubeSolvingStateEnum.OLL
      }
    }

    if (cubeSolvingState.state === CubeSolvingStateEnum.OLL) {
      // check if the OLL is solved
      const ollSolved = getOLLSolved(facelet, cubeSolvingState.color)
      if (ollSolved) {
        timer.saveCheckpoint()
        cubeSolvingState.state = CubeSolvingStateEnum.PLL
      }
    }
  }

  if (currentState == CubeState.SCRAMBLING_COMPLETE) {
    currentState = CubeState.SOLVING
    timer.startTimer()
    scrambleHandler.reset()
  }

  if (currentState === CubeState.SCRAMBLING) {
    const moves = inputMoveStr.toUpperCase().trim().split(/\s+/);
    scrambleHandler.processMoves(moves);
    if (scrambleHandler.isScrambleComplete()) {
      currentState = CubeState.SCRAMBLING_COMPLETE;
      cubeSolvingState.state = CubeSolvingStateEnum.SCRAMBLED;
    }
  }
}

/**
 * @param {import('./types.js').F2LIsSlotSolved | null} f2lSolved
 * @returns {number | undefined}
 */
function getF2LPairEvent(f2lSolved) {
  if (f2lSolved == null) return;
  let prev = cubeSolvingState.misc.f2lSolved ?? 0
  const res = +f2lSolved.DBL | (+f2lSolved.DFR) << 1 | (+f2lSolved.DLF) << 2 | (+f2lSolved.DRB) << 3;
  const curr = res | prev;
  cubeSolvingState.misc.f2lSolved = curr
  console.log("F2L Solved: ", { f2lSolved, prev, curr })
  if (cntBin1(prev) == cntBin1(curr)) return;
  return cntBin1(curr)
}

function cntBin1(n) {
  const base = 2
  return n.toString(base).replace(/0/g, '').length;
}


// Start with gizmos active
let gizmosActive = false
cube.toggleGizmos(gizmosActive)

// Connect QIYI Cube when the connect button is clicked
qiyiConnectButton.addEventListener('click', async () => {
  qiyiConnectButton.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`
  const connected = await qiyiHandler.connectCube()
  if (connected) {
    qiyiConnectButton.innerHTML = /*html */ `<icon>${BluetoothConnectedIcon}</icon>`
  } else {
    qiyiConnectButton.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`
    qiyiConnectButton.style.border = "1px solid red"
  }
})

// Toggle gizmos on/off and update the button's active class accordingly
toggleGizmosButton.addEventListener('click', () => {
  gizmosActive = !gizmosActive
  cube.toggleGizmos(gizmosActive)
  toggleGizmosButton.classList.toggle('active', gizmosActive)
})

// Scramble the cube when the scramble button is clicked
scrambleButton.addEventListener('click', async () => {
  if (currentState !== CubeState.SCRAMBLING) {
    currentState = CubeState.SCRAMBLING
    const randScramble = await randomScrambleForEvent("333")
    solve = new SolveData(randScramble.toString())
    scrambleHandler.setScramble(randScramble)
  }
})
