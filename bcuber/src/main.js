import './style.css'
import { RubiksCubeComponent } from './components/render-cube.js'
import { QiYiCubeController } from './components/qiyi/cubeController'
import { QIYI_CONFIG } from './components/qiyi/config'
import { randomScrambleForEvent } from 'cubing/scramble'
import { Alg } from 'cubing/alg'
import { CubeTimer } from './components/cubeTimer.js'
import { getCrossSolvedColor } from './components/faceletChecker.js'

const qiyiConnectButton = selectElement('#qiyi-connect-btn')
const cubeRenderDiv = selectElement('#cube')
// const debugCubeContainer = selectElement('#debug-cube-container')
const toggleGizmosButton = selectElement('#toggle-gizmos-btn')
const scrambleButton = selectElement('#scramble-button')
const scrambleDisplay = selectElement('#scramble-display')
const timerDisplay = selectElement('#timer-display')

// We'll store the scramble as an Alg, but also work with an array of moves.
let scramble = new Alg()
let scrambleIdx = 0

const timer = new CubeTimer(timerDisplay)

/**
 * @enum {string}
 */
const CubeState = {
  SCRAMBLING: "SCRAMBLING",
  SCRAMBLING_COMPLETE: "SCRAMBLING_COMPLETE",
  INSPECTING: "INSPECTING",
  SOLVING: "SOLVING",
  LIVE: "LIVE"
}

/**
 * @type {CubeState}
 */
let currentState = CubeState.LIVE

// Create the cube and controller instances
const cube = new RubiksCubeComponent(cubeRenderDiv)
const qiyiHandler = new QiYiCubeController(QIYI_CONFIG, onCubeMove, undefined)

/**
 * Normalize a move string.
 * @param {string} move
 * @returns {string} normalized move
 */
function normalizeMove(move) {
  move = move.trim()
  if (move.endsWith("2")) {
    const singleMove = move.slice(0, -1)
    return `${singleMove} ${singleMove}`
  }
  return move
}

/**
 * Get the inverse of a move.
 * For example: U -> U', U' -> U, U2 -> U2.
 * @param {string} move
 * @returns {string} inverse move.
 */
function getInverse(move) {
  if (move.endsWith("2")) {
    return move // 180° turns are self-inverse
  }
  if (move.endsWith("'")) {
    return move.slice(0, -1)
  }
  return move + "'"
}

/**
 * Extract an array of moves from the scramble.
 * If scramble.childAlgNodes is an array, use it;
 * otherwise, split the scramble string.
 * @returns {string[]} array of moves.
 */
function getScrambleMoves() {
  // Fallback: assume scramble.toString() returns moves separated by whitespace.
  return scramble.toString().toUpperCase().trim().split(/\s+/)
}

/**
 * Update the scramble display.
 * Moves that have been correctly executed are "greyed out" (by applying a CSS class).
 */
function updateScrambleDisplay() {
  const moves = getScrambleMoves()
  scrambleDisplay.innerHTML = moves
    .map((move, index) => {
      return index < scrambleIdx
        ? `<span class="done">${move}</span>`
        : `<span>${move}</span>`
    })
    .join(" ")
}

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
    .map(m => m.move.trim())
    .join(" ")

  // animate the cube 
  cube.addMoves(inputMoveStr)



  if (currentState === CubeState.LIVE) {
    return
  }

  if (currentState === CubeState.SOLVING) {
    // use facelet to decide the state of the cube
    // if the facelet is solved, then the cube is solved
    if (facelet === "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB") {
      currentState = CubeState.LIVE
      timer.stopTimer()
    }

    // check if the cross is done 
    console.log(getCrossSolvedColor(facelet))
  }

  if (currentState == CubeState.SCRAMBLING_COMPLETE) {
    currentState = CubeState.SOLVING
    timer.startTimer()
    scramble = new Alg()
    scrambleIdx = 0
    updateScrambleDisplay()
  }

  if (currentState === CubeState.SCRAMBLING) {
    const moves = inputMoveStr.toUpperCase().toUpperCase().trim().split(/\s+/)
    console.log("SCRAMBLING: ", { moves })
    let i = 0
    for (; i < moves.length; i++) {
      const actualMove = moves[i]
      const correctionMove = checkMoveWithScramble(actualMove, scrambleIdx + i)
      if (correctionMove) {
        console.log("Incorrect move, correcting with: ", correctionMove)
        break
      }
    }
    const reverseMoves = getReverseMoves(moves, i)
    if (reverseMoves != "") {
      // add the reversing moves into the scramble in scrambleIdx + i
      const prevScramble = scramble.toString().split(" ").slice(scrambleIdx + i).join(" ")
      console.log("[On Cube Move]: ", { prevScramble })
      const newScramble = new Alg(simplify(`${reverseMoves} ${prevScramble}`)).experimentalSimplify()
      scramble = newScramble
      scrambleIdx = 0
      updateScrambleDisplay()
    }

    if (scrambleIdx + i >= getScrambleMoves().length) {
      currentState = CubeState.SCRAMBLING_COMPLETE
    }

  }
}

/**
 * @param {string} scramble
 */
function simplify(scramble) {
  // find repetation of three moves and switch them with their inverses 
  const moves = scramble.trim().toUpperCase().toString().split(/\s+/)
  const newMovesStack = [moves[0]]
  for (let i = 1; i < moves.length; i++) {
    const currentMove = moves[i]
    newMovesStack.push(currentMove)

    if (newMovesStack.length >= 2) {
      const lastMove = newMovesStack[newMovesStack.length - 2]
      if (lastMove === getInverse(currentMove)) {
        newMovesStack.pop()
        newMovesStack.pop()
      }
    }

    // check if the stack has two moves already added 
    if (newMovesStack.length >= 3) {
      const firstMove = newMovesStack[newMovesStack.length - 3]
      const secondMove = newMovesStack[newMovesStack.length - 2]
      const thirdMove = newMovesStack[newMovesStack.length - 1]
      if (firstMove == secondMove && secondMove == thirdMove) {
        newMovesStack.pop()
        newMovesStack.pop()
        newMovesStack.pop()
        newMovesStack.push(getInverse(secondMove))
      }
    }
  }

  return newMovesStack.join(" ")
}

/**
 * @param {string[]} moves
 * @param {number} fromIdx
 */
function getReverseMoves(moves, fromIdx) {
  if (fromIdx >= moves.length) return ""
  const movesToReverse = moves.slice(fromIdx)
  const reversedMoves = movesToReverse.map(move => getInverse(move))
  return reversedMoves.join(" ")
}

/**
 * @param {string} singleMove // This is just a single move i.e R, U, U' etc and U2, R2 etc doesn't exists
 // This is just a single move i.e R, U, U' etc and U2, R2 etc doesn't exists
 * @param {number} idx
  * @returns {string | null} inverse move if the move was incorrect, null otherwise
 */
function checkMoveWithScramble(singleMove, idx) {
  const move = singleMove.trim().toUpperCase()
  const scrambleMove = getScrambleMoves()[idx]

  if (move === scrambleMove) {
    scrambleIdx++
  } else {
    const inverseMove = getInverse(singleMove)
    return inverseMove;
  }

  updateScrambleDisplay()
  return null
}

// Start with gizmos active
let gizmosActive = true
cube.toggleGizmos(gizmosActive)
toggleGizmosButton.classList.add('active')

// Connect QIYI Cube when the connect button is clicked
qiyiConnectButton.addEventListener('click', async () => {
  await qiyiHandler.connectCube()
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
    // convert all the moves to uppercase and things like r2 l2 f2 etc to r r l l etc 
    scramble = new Alg(randScramble.toString().split(" ").map(move => normalizeMove(move)).join(" "))
    console.log("Scramble moves: ", getScrambleMoves())
    scrambleIdx = 0
    updateScrambleDisplay()
  }
})

/**
 * Helper function to select an element by its ID.
 * @param {string} id
 * @returns {HTMLElement}
 */
function selectElement(id) {
  const res = document.querySelector(id)
  if (!res) {
    console.warn(`No element found with id: ${id}`)
    throw new Error(`No element found with id: ${id}`)
  }
  // @ts-ignore
  return res
}

