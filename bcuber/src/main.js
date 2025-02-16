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
import { RecentSolveView } from './components/recent-solve-view.js'

const qiyiConnectButton = selectElement('#qiyi-connect-btn')
const cubeRenderDiv = selectElement('#cube')
const toggleGizmosButton = selectElement('#toggle-gizmos-btn')
const scrambleButton = selectElement('#scramble-button')
const scrambleDisplay = selectElement('#scramble-display')
const timerDisplay = selectElement('#timer-display')
const recentSolvedStatsView = selectElement('#recent-solve-view')
const autoTimerButton = selectElement('#auto-timer-btn')
const autoScrambleOnSolveButton = selectElement('#auto-scramble-on-solve-btn')
const historyTableContainer = selectElement('#solve-history-view')

const debugCubeContainer = document.querySelector('#debug-cube-container')
const timer = new CubeTimer(timerDisplay)
const scrambleHandler = new ScrambleHandler(scrambleDisplay);
/**
* @type {SolveData | null}
*/
let solve = null;
const historyHandler = new SolveDataTable(historyTableContainer)

const recentSolvedViewHandler = new RecentSolveView(recentSolvedStatsView, historyHandler.solves[historyHandler.solves.length - 1])
recentSolvedViewHandler.render()

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

let turnInspectionOnAutomatically = false
toggleAutoTimer(); // this is to set the initial state of the button

let autoScrambleOnSolve = false
toggleAutoScrambleOnSolve(); // this is to set the initial state of the button


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

  if (currentState === CubeState.LIVE) {
    return
  }

  if (currentState == CubeState.SCRAMBLING_COMPLETE) {
    // and on next cube move
    currentState = CubeState.SOLVING
    timer.startTimer()
    timer.resetInspectionTimer()
  }

  if (currentState === CubeState.SOLVING) {
    // add the move to the solve data for saving
    inputMoveStr.split(/\s+/).forEach(move => solve?.addMove(move))
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

      recentSolvedViewHandler.solveData = historyHandler.solves[historyHandler.solves.length - 1]
      recentSolvedViewHandler.render()
      historyHandler.render()

      if (autoScrambleOnSolve) {
        scrambleCube()
      }
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

  if (currentState === CubeState.SCRAMBLING) {
    const moves = inputMoveStr.toUpperCase().trim().split(/\s+/);
    scrambleHandler.processMoves(moves);
    if (scrambleHandler.isScrambleComplete()) {
      currentState = CubeState.SCRAMBLING_COMPLETE;
      cubeSolvingState.state = CubeSolvingStateEnum.SCRAMBLED;
      scrambleHandler.reset()

      if (turnInspectionOnAutomatically) {
        timer.startInspectionTimer(() => {
          currentState = CubeState.SOLVING
          timer.startTimer()
        });
      }
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
  connectWithBluetooth();
})

// Toggle gizmos on/off and update the button's active class accordingly
toggleGizmosButton.addEventListener('click', () => {
  gizmosActive = !gizmosActive
  cube.toggleGizmos(gizmosActive)
  toggleGizmosButton.classList.toggle('active', gizmosActive)
})

// Scramble the cube when the scramble button is clicked
scrambleButton.addEventListener('click', async () => {
  await scrambleCube()
})

// Toggle the auto timer on/off and update the button's active class accordingly
autoTimerButton.addEventListener('click', () => {
  toggleAutoTimer()
});

// Toggle the auto scramble on solve on/off and update the button's active class accordingly
autoScrambleOnSolveButton.addEventListener('click', () => {
  toggleAutoScrambleOnSolve()
});

async function connectWithBluetooth() {
  qiyiConnectButton.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`
  const connected = await qiyiHandler.connectCube()
  if (connected) {
    qiyiConnectButton.innerHTML = /*html */ `<icon>${BluetoothConnectedIcon}</icon>`
    await scrambleCube()
  } else {
    qiyiConnectButton.innerHTML = /* html */ `<icon> ${BluetoothConnectingIcon} </icon>`
    qiyiConnectButton.style.border = "1px solid red"
  }
}

// on b connect with bluetooth 
document.body.addEventListener('keydown', async (e) => {
  if (e.key === "b") {
    await connectWithBluetooth()
  }
});

async function scrambleCube() {
  if (currentState !== CubeState.SCRAMBLING) {
    currentState = CubeState.SCRAMBLING
    const randScramble = await randomScrambleForEvent("333")
    solve = new SolveData(randScramble.toString())
    scrambleHandler.setScramble(randScramble)
  }
}

async function toggleAutoTimer() {
  turnInspectionOnAutomatically = !turnInspectionOnAutomatically
  if (turnInspectionOnAutomatically) {
    autoTimerButton.classList.add('active')
  } else {
    autoTimerButton.classList.remove('active')
  }
}

async function toggleAutoScrambleOnSolve() {
  autoScrambleOnSolve = !autoScrambleOnSolve
  if (autoScrambleOnSolve) {
    autoScrambleOnSolveButton.classList.add('active')
  } else {
    autoScrambleOnSolveButton.classList.remove('active')
  }
}