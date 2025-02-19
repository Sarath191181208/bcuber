/**
 * CubeTimer class to manage a simple stopwatch timer.
 */
export class CubeTimer {
    /**
     * Creates an instance of CubeTimer.
     * @param {number} numSegments - The number of segments to save.
     * @param {HTMLElement | null} timerElement - The HTML element to display the timer. If null, no display updates will occur.
     */
    constructor(numSegments, timerElement = null) {
        this.timerElement = timerElement
        this.timer = null
        this.startTime = null

        this.numSegments = numSegments
        this.segments = []
        this.segmentIdx = 0 


        this.inspectionStartTime = null
        this.inspectionTimer = null
        this.inspectViewTimer = null
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
     * Starts the inspection timer.
     * @param {() => void} fn
     */
    startInspectionTimer(fn) {
        this.resetInspectionTimer()
        this.inspectionStartTime = Date.now()
        this.inspectionTimer = setTimeout(() => {
            fn()
        }, 15000)

        // update the timer every 1s
        this.inspectViewTimer = setInterval(() => {
            // @ts-ignore
            const elapsedTime = (Date.now() - this.inspectionStartTime) / 1000
            if (this.timerElement) {
                this.timerElement.innerText = (15 - elapsedTime).toFixed(0)
            }
        }, 1000)
    }

    /**
     * Cancels the inspection timer.
    */
    resetInspectionTimer() {
        this.inspectionStartTime = null;
        clearTimeout(this.inspectionTimer ?? 0)
        clearInterval(this.inspectViewTimer ?? 0)
    }


    /**
     * save checkpoint segment 
     */
    saveCheckpoint() {
        if (this.startTime) {
            if (this.segmentIdx >= this.numSegments) {
                throw new Error("Too many checkpoints")
            }
            // @ts-ignore
            // this.segments.push((Date.now() - this.startTime) / 1000)
            this.segments[this.segmentIdx] = (Date.now() - this.startTime) / 1000
            this.segmentIdx += 1
        }
    }

    /**
     * Stops the timer.
     */
    stopTimer() {
        clearInterval(this.timer ?? 0)
        clearInterval(this.inspectViewTimer ?? 0)
        clearTimeout(this.inspectionTimer ?? 0)
    }

    /**
     * Resets the timer display to "0.00".
     */
    resetTimer() {
        if (this.timerElement) {
            this.timerElement.innerText = "0.00"
        }
        this.segments = new Array(this.numSegments).fill(0)
        this.segmentIdx = 0
    }

    getCheckpointSegments() {
        return this.segments
    }
}