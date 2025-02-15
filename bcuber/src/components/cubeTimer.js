/**
 * CubeTimer class to manage a simple stopwatch timer.
 */
export class CubeTimer {
    /**
     * Creates an instance of CubeTimer.
     * @param {HTMLElement | null} timerElement - The HTML element to display the timer. If null, no display updates will occur.
     */
    constructor(timerElement = null) {
        this.timerElement = timerElement
        this.timer = null
        this.startTime = null
        this.segments = []
    }

    /**
     * Starts the timer.
     */
    startTimer() {
        this.resetTimer();
        this.startTime = Date.now()
        this.timer = setInterval(() => {
            // @ts-ignore
            const elapsedTime = (Date.now() - this.startTime) / 1000
            if (this.timerElement) {
                this.timerElement.innerText = elapsedTime.toFixed(2)
            }
        }, 10)
    }

    /**
     * save checkpoint segment 
     */
    saveCheckpoint() {
        if (this.startTime) {
            // @ts-ignore
            this.segments.push((Date.now() - this.startTime) / 1000)
        }
    }

    /**
     * Stops the timer.
     */
    stopTimer() {
        clearInterval(this.timer ?? 0)
    }

    /**
     * Resets the timer display to "0.00".
     */
    resetTimer() {
        if (this.timerElement) {
            this.timerElement.innerText = "0.00"
        }
        this.segments = []
    }

    getCheckpointSegments() {
        return this.segments
    }
}