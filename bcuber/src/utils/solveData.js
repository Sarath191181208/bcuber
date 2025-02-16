//@ts-check

import { CubeTimer } from "../components/cubeTimer";

export class SolveData {
    /**
     * @param {string} scramble
     */
    constructor(scramble) {
        this.scramble = scramble;   // The scramble string used for the solve
        this.moves = [];            // Array of { move: string, timestamp: number }
        this.checkpoints = [];      // Array of checkpoint timestamps (in ms from start)
        this.startTime = null;      // Solve start time (to be set when started)
        this.endTime = null;        // Solve end time (to be set when solved)
    }

    /**
     * @param {string} move
     */
    addMove(move) {
        this.moves.push({ move, timestamp: Date.now() });
    }

    /**
     * @param {CubeTimer} cubeTimer
     */
    cloneFromTimer(cubeTimer) {
        this.startTime = cubeTimer.startTime;
        this.endTime = Date.now();
        this.checkpoints = cubeTimer.getCheckpointSegments();
    }

    /**
     * Convert the timestamps to relative times from the start of the solve.
     */
    convertTimestampsToRelative() {
        if (!this.startTime) return;
        return this.moves.map(m => ({
            move: m.move,
            // @ts-ignore
            timestamp: m.timestamp - this.startTime
        }));
    }
}

// Class to render all saved solves in a table in the left sidebar
export class SolveDataTable {
    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        this.container = container;
        this.storage = new SolveDataStorage();
        this.solves = this.storage.loadSolves();
        this.viewMode = 'time';
        this.render();
    }

    /**
    * Toggle the view mode and re-render.
    */
    toggleView() {
        this.viewMode = this.viewMode === 'time' ? 'moves' : 'time';
        this.render();
    }


    /**
     * @param {any} solveData
     */
    addSolve(solveData) {
        this.solves.push(solveData);
        this.storage.saveSolves(this.solves);
        this.render();
    }

    render() {
        // Set up toggle button text and icon based on current view mode.
        const toggleButtonIcon = this.viewMode === 'time' ? '✋' : '⏱️';
        const toggleButtonText = this.viewMode === 'time' ? 'Switch to Moves View' : 'Switch to Time View';

        let html = `
            <button id="toggleViewButton" style="margin-bottom:10px; padding: 6px 12px; cursor:pointer;">
                ${toggleButtonText} ${toggleButtonIcon}
            </button>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="">Cross</th>
                        <th style="">F2L 1</th>
                        <th style="">F2L 2</th>
                        <th style="">F2L 3</th>
                        <th style="">F2L 4</th>
                        <th style="">OLL</th>
                        <th style="">PLL</th>
                        <th style="">Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.solves.forEach(s => {
            // We expect 8 checkpoints: [0, cross, f2l1, f2l2, f2l3, f2l4, oll, pll]
            const checkpoints = s.checkpoints || [];
            if (checkpoints.length < 7 || !s.startTime || !s.endTime) return;

            // Calculate phase times in seconds.
            const crossTime = checkpoints[0];
            const f2l1 = checkpoints[1] - checkpoints[0];
            const f2l2 = checkpoints[2] - checkpoints[1];
            const f2l3 = checkpoints[3] - checkpoints[2];
            const f2l4 = checkpoints[4] - checkpoints[3];
            const oll = checkpoints[5] - checkpoints[4];
            const pll = checkpoints[6] - checkpoints[5];

            // Convert move timestamps to relative times.
            const relativeMoves = s.convertTimestampsToRelative();

            // Count moves in each phase.
            const crossMoves = countMovesBetween(relativeMoves, 0, checkpoints[0]);
            const f2l1Moves = countMovesBetween(relativeMoves, checkpoints[0], checkpoints[1]);
            const f2l2Moves = countMovesBetween(relativeMoves, checkpoints[1], checkpoints[2]);
            const f2l3Moves = countMovesBetween(relativeMoves, checkpoints[2], checkpoints[3]);
            const f2l4Moves = countMovesBetween(relativeMoves, checkpoints[3], checkpoints[4]);
            const ollMoves = countMovesBetween(relativeMoves, checkpoints[4], checkpoints[5]);
            const pllMoves = countMovesBetween(relativeMoves, checkpoints[5], checkpoints[6]);

            // Total time (in seconds) from solve start to end.
            const totalTime = ((s.endTime - s.startTime) / 1000).toFixed(2);

            // Helper function: returns cell content based on the current view mode.
            const cell = (time, moves) => {
                if (this.viewMode === 'time') {
                    return `${time.toFixed(2)} s`;
                } else {
                    return `${moves}`;
                }
            };

            html += /*html*/`
                <tr>
                    <td style="text-align: center;">
                        ${cell(crossTime, crossMoves)}
                    </td>
                    <td style="text-align: center;">
                        ${cell(f2l1, f2l1Moves)}
                    </td>
                    <td style="text-align: center;">
                        ${cell(f2l2, f2l2Moves)}
                    </td>
                    <td style="text-align: center;">
                        ${cell(f2l3, f2l3Moves)}
                    </td>
                    <td style="text-align: center;">
                        ${cell(f2l4, f2l4Moves)}
                    </td>
                    <td style="text-align: center;">
                        ${cell(oll, ollMoves)}
                    </td>
                    <td style="text-align: center;">
                        ${cell(pll, pllMoves)}
                    </td>
                    <td style="text-align: center;">
                        ${this.viewMode === 'time'
                    ? `${totalTime} s`
                    : `${s.moves.length} moves`
                }
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        if (this.solves.length === 0) {
            html = `<p style='text-align: center; color: #383838'>No solves yet.</p>`;
        }
        this.container.innerHTML = html;

        // Attach event listener to the toggle button.
        const toggleButton = document.getElementById("toggleViewButton");
        if (toggleButton) {
            toggleButton.addEventListener("click", () => this.toggleView());
        }
    }
}

const countMovesBetween = (moves, startSec, endSec) => {
    return moves.filter(m => (m.timestamp / 1000) >= startSec && (m.timestamp / 1000) < endSec).length;
};


class SolveDataStorage {
    prefixKey = "V1";

    /**
     * @param {string} storageKey - The key to use in local storage.
     */
    constructor(storageKey = "solves") {
        this.storageKey = storageKey;
    }

    get key() {
        return this.prefixKey + this.storageKey;
    }

    /**
     * Loads the saved solves from local storage.
     * @returns {SolveData[]} Array of saved solve objects.
     */
    loadSolves() {
        const savedSolves = localStorage.getItem(this.key);
        if (savedSolves) {
            try {
                // return JSON.parse(savedSolves);
                const jsonParsed = JSON.parse(savedSolves);
                return jsonParsed.map(s => {
                    const solve = new SolveData(s.scramble);
                    solve.moves = s.moves;
                    solve.checkpoints = s.checkpoints;
                    solve.startTime = s.startTime;
                    solve.endTime = s.endTime;
                    return solve;
                });
            } catch (e) {
                console.error("Error parsing saved solves from local storage", e);
            }
        }
        return [];
    }

    /**
     * Saves the provided solves array to local storage.
     * @param {Array} solves - Array of solve objects to save.
     */
    saveSolves(solves) {
        localStorage.setItem(this.key, JSON.stringify(solves));
    }
}
