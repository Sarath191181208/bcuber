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
        // Holds a pending quarter–move when a double move is only half-completed.
        this.pendingHalf = null;
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
     * Moves that have been executed (index less than scrambleIdx) are "greyed out".
     * If a double move is half-completed, it gets a "half-done" CSS class.
     */
    updateDisplay() {
        const moves = this.getScrambleMoves();
        this.displayElement.innerHTML = moves
            .map((move, index) => {
                if (index < this.scrambleIdx) {
                    return `<span class="done">${move}</span>`;
                } else if (
                    index === this.scrambleIdx &&
                    move.endsWith("2") &&
                    this.pendingHalf !== null
                ) {
                    return `<span class="half-done">${move}</span>`;
                } else {
                    return `<span>${move}</span>`;
                }
            })
            .join(" ");
    }

    /**
     * Checks a single move against the expected scramble move.
     * If correct, increments scrambleIdx (or awaits a second half for a double move)
     * and updates the display.
     * If incorrect, returns the inverse move.
     *
     * For expected moves ending with "2" (e.g. "U2"):
     *   - The full move (e.g. "U2") is accepted immediately.
     *   - Alternatively, if the user provides a quarter–move (either "U" or "U'"),
     *     it is marked as half complete. The second half must match the first.
     *   - If the second half does not match, the move is considered wrong.
     *
     * @param {string} singleMove - A single move input (e.g. "R", "U'", etc.).
     * @returns {string | null} The inverse move if the input move is incorrect; otherwise null.
     */
    checkMove(singleMove) {
        const move = singleMove.trim().toUpperCase();

        // If we're in the middle of a double move (one half already applied)
        if (this.pendingHalf !== null) {
            // The second half must match the pending half (e.g. if first half was "U", second must be "U")
            if (move === this.pendingHalf) {
                // Correct completion of the double move:
                this.pendingHalf = null;
                this.scrambleIdx++;
                this.updateDisplay();
                return null;
            } else {
                // Wrong second half – return inverse of the pending half as a correction.
                const correction = getInverse(this.pendingHalf);
                // Clear the pending half since the double move wasn’t completed properly.
                this.pendingHalf = null;
                this.updateDisplay();
                return correction;
            }
        }

        // No pending half move; get the expected move.
        const expected = this.getScrambleMoves()[this.scrambleIdx];

        // If the expected move is NOT a double move:
        if (!expected.endsWith("2")) {
            if (move === expected) {
                this.scrambleIdx++;
                this.updateDisplay();
                return null;
            } else {
                return getInverse(move);
            }
        } else {
            // Expected move is a double move (ends with "2"), e.g. "U2".
            const face = expected[0]; // e.g. "U"
            // Option 1: User inputs the full double move (like "U2")
            if (move === expected) {
                this.scrambleIdx++;
                this.updateDisplay();
                return null;
            }
            // Option 2: User inputs a quarter–move.
            // Allow either quarter turn (clockwise or anticlockwise)
            else if (move === face || move === face + "'") {
                // Mark the move as half-complete.
                this.pendingHalf = move;
                this.updateDisplay();
                return null;
            } else {
                // Move is not acceptable.
                return getInverse(move);
            }
        }
    }

    /**
     * Process multiple moves.
     * @param {string[]} moves - The moves to process.
     */
    processMoves(moves) {
        let i = 0;
        for (; i < moves.length; i++) {
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
     * Additionally, if a double move was only half-completed, it will be reverted.
     *
     * @param {string[]} moves - The moves input by the user.
     * @param {number} processedCount - The number of moves that were processed correctly.
     */
    processError(moves, processedCount) {
        // If a half move is pending, include its inverse in the reversal.
        let extraReverse = "";
        if (this.pendingHalf !== null) {
            extraReverse = getInverse(this.pendingHalf);
            this.pendingHalf = null;
        }
        const reverseMoves = this.getReverseMoves(moves, processedCount);
        // Combine any extra reverse (from pending half) with the rest.
        const fullReverse = extraReverse ? `${extraReverse} ${reverseMoves}` : reverseMoves;

        if (fullReverse.trim() !== "") {
            // Get the remaining scramble moves.
            // Note: processedCount includes any quarter–move that was applied.
            const remainingMoves = this.getScrambleMoves()
                .slice(this.scrambleIdx + processedCount)
                .join(" ");
            const newScrambleStr = simplify(`${fullReverse} ${remainingMoves}`);
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
        this.pendingHalf = null;
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
            scramble
            // scramble.toString().split(/\s+/).map(normalizeMove).join(" ")
        );
        this.scrambleIdx = 0;
        this.pendingHalf = null;
        this.updateDisplay();
    }

    /**
     * Check if the scramble is complete.
     * @returns {boolean} True if the scramble is complete; otherwise, false.
     */
    isScrambleComplete() {
        return this.scrambleIdx >= this.getScrambleMoves().length;
    }
}
