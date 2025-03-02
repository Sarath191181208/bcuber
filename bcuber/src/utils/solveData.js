//@ts-check

import { CubeTimer } from "../components/cubeTimer";
import { HistoryIcon } from "./icons";
import { SolveDataStorage } from "./storage/solveData";

export class SolveData {
    /**
     * @param {string} scramble
     */
    constructor(scramble) {
        this.scramble = scramble; // The scramble string used for the solve
        /**
         * @type {Array<{ move: string, timestamp: number }>}
         */
        this.moves = []; // Array of { move: string, timestamp: number }
        this.checkpoints = []; // Array of checkpoint timestamps (in ms from start)
        this.startTime = 0; // Solve start time (to be set when started)
        this.endTime = 0; // Solve end time (to be set when solved)
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
        this.startTime = cubeTimer.startTime ?? new Date().getTime();
        this.endTime = Date.now();
        this.checkpoints = cubeTimer.getCheckpointSegments();
    }

    /**
     * Convert the timestamps to relative times from the start of the solve.
     */
    convertTimestampsToRelative() {
        if (!this.startTime) return;
        return this.moves.map((m) => ({
            move: m.move,
            // @ts-ignore
            timestamp: m.timestamp - this.startTime,
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
        this.viewMode = "time";
        this.render();
    }

    /**
     * Toggle the view mode and re-render.
     */
    toggleView() {
        this.viewMode = this.viewMode === "time" ? "moves" : "time";
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
        // Determine the toggle button's icon and text based on the view mode.
        const toggleButtonIcon = this.viewMode === "time" ? "✋" : "⏱️";
        const toggleButtonText =
            this.viewMode === "time" ? "Switch to Moves View" : "Switch to Time View";

        let html = /*html*/ `
    <div class="history-table">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      ">
        <h2 style="margin: 0; font-size: 1.75rem;display:flex;gap:5px;"><icon>${HistoryIcon}</icon>Solve History</h2>
        <button id="toggleViewButton">
          ${toggleButtonText} ${toggleButtonIcon}
        </button>
      </div>
      <table style="
        width: 100%;
        border-collapse: collapse;
      ">
        <thead>
          <tr style="background: #2c2c2c;">
            <th style="padding: 12px; border: 1px solid #444;">Cross</th>
            <th style="padding: 12px; border: 1px solid #444;">F2L 1</th>
            <th style="padding: 12px; border: 1px solid #444;">F2L 2</th>
            <th style="padding: 12px; border: 1px solid #444;">F2L 3</th>
            <th style="padding: 12px; border: 1px solid #444;">F2L 4</th>
            <th style="padding: 12px; border: 1px solid #444;">OLL</th>
            <th style="padding: 12px; border: 1px solid #444;">PLL</th>
            <th style="padding: 12px; border: 1px solid #444;">Total</th>
          </tr>
        </thead>
        <tbody>
  `;

        this.solves.reverse().forEach((s) => {
            // We expect 7 checkpoints: [cross, f2l1, f2l2, f2l3, f2l4, oll, pll]
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
            const f2l1Moves = countMovesBetween(
                relativeMoves,
                checkpoints[0],
                checkpoints[1]
            );
            const f2l2Moves = countMovesBetween(
                relativeMoves,
                checkpoints[1],
                checkpoints[2]
            );
            const f2l3Moves = countMovesBetween(
                relativeMoves,
                checkpoints[2],
                checkpoints[3]
            );
            const f2l4Moves = countMovesBetween(
                relativeMoves,
                checkpoints[3],
                checkpoints[4]
            );
            const ollMoves = countMovesBetween(
                relativeMoves,
                checkpoints[4],
                checkpoints[5]
            );
            const pllMoves = countMovesBetween(
                relativeMoves,
                checkpoints[5],
                checkpoints[6]
            );

            // Total time (in seconds) from solve start to end.
            const totalTime = ((s.endTime - s.startTime) / 1000).toFixed(2);

            // Helper function: returns cell content based on current view mode.
            const cell = (time, moves) => {
                return this.viewMode === "time" ? `${time.toFixed(2)} s` : `${moves}`;
            };

            html += `
      <tr class="solve-row">
        <td style="text-align: center; padding: 12px;">${cell(
                crossTime,
                crossMoves
            )}</td>
        <td style="text-align: center; padding: 12px;">${cell(
                f2l1,
                f2l1Moves
            )}</td>
        <td style="text-align: center; padding: 12px;">${cell(
                f2l2,
                f2l2Moves
            )}</td>
        <td style="text-align: center; padding: 12px;">${cell(
                f2l3,
                f2l3Moves
            )}</td>
        <td style="text-align: center; padding: 12px;">${cell(
                f2l4,
                f2l4Moves
            )}</td>
        <td style="text-align: center; padding: 12px;">${cell(
                oll,
                ollMoves
            )}</td>
        <td style="text-align: center; padding: 12px;">${cell(
                pll,
                pllMoves
            )}</td>
        <td style="text-align: center; padding: 12px;">
          ${this.viewMode === "time"
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
    </div>
  `;

        if (this.solves.length === 0) {
            html = `<p style="text-align: center; color: #888;">No solves yet.</p>`;
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
    return moves.filter(
        (m) => m.timestamp / 1000 >= startSec && m.timestamp / 1000 < endSec
    ).length;
};