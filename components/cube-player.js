/**
 * Interface for a Twisty Player that can execute moves and adjust tempo.
 * @typedef {Object} TwistyPlayerInterface
 * @property {number} changeTempo - The speed at which moves are executed.
 * @property {Function} executeMove - Executes a given move.
 * @property {Function} reset - Resets the cube to its initial state.
 */

class TwistyPlayerController {
    /**
     * @param {TwistyPlayerInterface} twistyPlayer - The twisty player instance.
     */
    constructor(twistyPlayer) {
        this.twistyPlayer = twistyPlayer;
        this.prevMoves = [];
        this.currentIndex = 0;
        this.isPlaying = false;
    }

    /**
     * @type {TwistyPlayerInterface}
     * @private
     * @readonly
     */
    twistyPlayer;

    /**
     * @type {string[]}
     */
    prevMoves;

    /**
     * @type {number}
     */
    currentIndex;

    /**
     * @type {boolean}
     */
    isPlaying;


    /**
     * Starts playing the recorded moves if not already playing.
     */
    play() {
        if (!this.isPlaying && this.prevMoves.length > 0) {
            this.isPlaying = true;
            this._processNextMove();
        }
    }

    /**
     * Stops playback and resets the move index.
     */
    stop() {
        this.isPlaying = false;
        this.currentIndex = 0;
    }

    /**
     * Resets the cube to its initial state and clears move history.
     */
    resetCube() {
        this.stop();
        this.prevMoves = [];
        this.twistyPlayer.reset();
    }

    /**
     * Adds a move to the sequence.
     * @param {string} move - The move notation to be added.
     */
    addMove(move) {
        this.prevMoves.push(move);
    }

    /**
     * Processes the next move in the sequence.
     * @private
     */
    _processNextMove() {
        if (this.currentIndex >= this.prevMoves.length) {
            this.twistyPlayer.changeTempo = 2;
            this.isPlaying = false;
            return;
        }

        const nextMove = this.prevMoves[this.currentIndex];
        console.log("[Playing]:", { nextMove, currentIndex: this.currentIndex });
        this.currentIndex++;

        const remaining = this.prevMoves.length - this.currentIndex;
        this.twistyPlayer.changeTempo = this._getTempoScale(remaining);

        this.twistyPlayer.executeMove(nextMove);

        const baseDelay = 1000;
        const delay = baseDelay / this.twistyPlayer.changeTempo;

        setTimeout(() => this._processNextMove(), delay);
    }

    /**
     * Maps a value from one range to another.
     * @private
     * @param {number} r1 - Current range value.
     * @param {number} r2 - Target range.
     * @param {number} v1 - Minimum output value.
     * @param {number} v2 - Maximum output value.
     * @returns {number} - Mapped value.
     */
    _mapRange(r1, r2, v1, v2) {
        return v1 + (v2 - v1) * (r1 / r2);
    }

    /**
     * Determines the tempo scaling based on remaining moves.
     * @private
     * @param {number} remainingMoves - The number of moves left.
     * @returns {number} - The calculated tempo scale.
     */
    _getTempoScale(remainingMoves) {
        return this._mapRange(remainingMoves, 5, 2, 6);
    }
}