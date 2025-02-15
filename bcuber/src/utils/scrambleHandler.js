import { Alg } from "cubing/alg";
import { getInverse, normalizeMove, simplify } from "./moveUitls.js";

/**
 * Class to encapsulate scramble state and logic.
 */
export class ScrambleHandler {
    /**
     * @param {HTMLElement} displayElement - The DOM element where the scramble will be displayed.
     */
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.scrambleAlg = new Alg();
        this.scrambleIdx = 0;
    }

    /**
     * Extract an array of moves from the scramble.
     * @returns {string[]} Array of moves.
     */
    getScrambleMoves() {
        // Assumes scrambleAlg.toString() returns moves separated by whitespace.
        return this.scrambleAlg.toString().toUpperCase().trim().split(/\s+/);
    }

    /**
     * Updates the scramble display.
     * Moves that have been executed (index less than scrambleIdx) are "greyed out" via a CSS class.
     */
    updateDisplay() {
        const moves = this.getScrambleMoves();
        this.displayElement.innerHTML = moves
            .map((move, index) =>
                index < this.scrambleIdx
                    ? `<span class="done">${move}</span>`
                    : `<span>${move}</span>`
            )
            .join(" ");
    }

    /**
     * Checks a single move against the expected scramble move.
     * If correct, increments scrambleIdx and updates the display.
     * If incorrect, returns the inverse move.
     *
     * @param {string} singleMove - A single move input (e.g. "R", "U'", etc.).
     * @returns {string | null} The inverse move if the input move is incorrect; otherwise null.
     */
    checkMove(singleMove) {
        const move = singleMove.trim().toUpperCase();
        const expected = this.getScrambleMoves()[this.scrambleIdx];
        if (move === expected) {
            this.scrambleIdx++;
            this.updateDisplay();
            return null;
        } else {
            return getInverse(singleMove);
        }
    }

    /**
     * Process multiple moves
     * @param {string[]} moves - The moves to process.
     *
     */
    processMoves(moves) {
        let i = 0;
        for (; i < moves.length; i++) {
            // Use the ScrambleHandler to check the move.
            const correctionMove = this.checkMove(moves[i]);
            if (correctionMove) {
                console.log("Incorrect move, correcting with: ", correctionMove);
                break;
            }
        }
        // If an incorrect move was detected, process the error.
        if (i < moves.length) {
            this.processError(moves, i);
        }
    }

    /**
     * Generates reverse moves for a given list of moves starting from a specified index.
     *
     * @param {string[]} moves - The moves to reverse.
     * @param {number} fromIdx - The starting index.
     * @returns {string} The reversed moves as a space-separated string.
     */
    getReverseMoves(moves, fromIdx) {
        if (fromIdx >= moves.length) return "";
        const movesToReverse = moves.slice(fromIdx);
        const reversedMoves = movesToReverse.map((move) => getInverse(move));
        return reversedMoves.join(" ");
    }

    /**
     * Processes an error in the scramble input.
     * If incorrect moves have been applied, this method computes the reverse moves,
     * combines them with the remaining scramble, simplifies the result,
     * and then updates the scramble algorithm and resets the scramble index.
     *
     * @param {string[]} moves - The moves input by the user.
     * @param {number} processedCount - The number of moves that were processed correctly.
     */
    processError(moves, processedCount) {
        const reverseMoves = this.getReverseMoves(moves, processedCount);
        if (reverseMoves !== "") {
            // Get the remaining scramble moves after the processed moves.
            const remainingMoves = this.getScrambleMoves()
                .slice(this.scrambleIdx + processedCount)
                .join(" ");
            // Combine the reverse moves with the remaining moves and simplify.
            const newScrambleStr = simplify(`${reverseMoves} ${remainingMoves}`);
            // Create a new scramble using the simplified string.
            this.scrambleAlg = new Alg(newScrambleStr).experimentalSimplify();
            this.scrambleIdx = 0;
            this.updateDisplay();
        }
    }

    /**
     * Resets the scramble handler by creating a new scramble and resetting the index.
     */
    reset() {
        this.scrambleAlg = new Alg();
        this.scrambleIdx = 0;
        this.updateDisplay();
    }

    /**
     * Sets a new scramble from a provided scramble string.
     * Typically used when generating a new scramble.
     *
     * @param {Alg} scramble - The scramble string (typically normalized).
     */
    setScramble(scramble) {
        this.scrambleAlg = new Alg(
            scramble.toString().split(/\s+/).map(normalizeMove).join(" ")
        );
        this.scrambleIdx = 0;
        this.updateDisplay();
    }

    /**
     * Chekc if the scramble is complete
     * @returns {boolean} True if the scramble is complete; otherwise, false.
     */
    isScrambleComplete() {
        return this.scrambleIdx >= this.getScrambleMoves().length;
    }
}
