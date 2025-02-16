import { SolveData } from "../utils/solveData";

/**
 * Utility function to count moves between two times (in seconds).
 * @param {Array<{ move: string, timestamp: number }>} moves - Array of moves with relative timestamps (ms).
 * @param {number} startSec - Start time in seconds.
 * @param {number} endSec - End time in seconds.
 * @returns {number} Number of moves between startSec (inclusive) and endSec (exclusive).
 */
const countMovesBetween = (moves, startSec, endSec) => {
    return moves.filter(
        m => (m.timestamp / 1000) >= startSec && (m.timestamp / 1000) < endSec
    ).length;
};

/**
 * RecentSolveView component displays detailed info for one solve.
 * It shows overall metrics (Time, Moves, TPS, Fluency) and a breakdown for each stage:
 * Cross, F2L (with subcategories F1, F2, F3, F4), OLL, and PLL.
 *
 * Assumptions:
 * - s.checkpoints is an array of 8 numbers in seconds:
 *   [0, cross, F1, F2, F3, F4, OLL, PLL]
 * - s.startTime and s.endTime are in milliseconds.
 * - s.moves is an array of move objects with timestamps in milliseconds.
 * - s.convertTimestampsToRelative() returns moves with timestamps relative to s.startTime.
 *
 * @example
 * const container = document.getElementById("recent-solve");
 * const recentSolveView = new RecentSolveView(container, solveData);
 * recentSolveView.render();
 */
export class RecentSolveView {
    /**
     * @param {HTMLElement} container - The container element where the view will be rendered.
     * @param {SolveData} solveData - The solve data object.
     */
    constructor(container, solveData) {
        this.container = container;
        this.solveData = solveData;
    }

    render() {
        const s = this.solveData;
        // Validate that required data exists.
        if (!s.startTime || !s.endTime || !s.checkpoints || s.checkpoints.length < 7) {
            this.container.innerHTML = `<p style="color: #ccc;">No valid solve data available.</p>`;
            return;
        }

        // Overall metrics
        const totalTimeSec = (s.endTime - s.startTime) / 1000;
        const totalMoves = s.moves.length;
        const overallTPS = totalTimeSec > 0 ? totalMoves / totalTimeSec : 0;

        // Calculate F2L TPS for fluency rating (F2L spans from checkpoints[1] to checkpoints[5])
        const cps = s.checkpoints;
        const totalF2LTime = cps[5] - cps[1];
        const relativeMoves = s.convertTimestampsToRelative();
        if (!relativeMoves) {
            this.container.innerHTML = `<p style="color: #ccc;">No valid solve data available.</p>`;
            return;
        }
        const f2lMoves = countMovesBetween(relativeMoves, cps[1], cps[5]);
        const f2lTPS = totalF2LTime > 0 ? f2lMoves / totalF2LTime : 0;

        let fluencyRating = '';
        if (f2lTPS >= 4) {
            fluencyRating = 'Excellent';
        } else if (f2lTPS >= 3) {
            fluencyRating = 'Good';
        } else {
            fluencyRating = 'Needs Work';
        }

        const stages = [
            { label: 'Cross', start: cps[0], end: cps[1] },
            { label: 'F1', start: cps[1], end: cps[2] },
            { label: 'F2', start: cps[2], end: cps[3] },
            { label: 'F3', start: cps[3], end: cps[4] },
            { label: 'F4', start: cps[4], end: cps[5] },
            { label: 'OLL', start: cps[5], end: cps[6] },
            { label: 'PLL', start: cps[6], end: cps[7] }
        ];

        let stagesHtml = '';
        for (const stage of stages) {
            const stageTime = stage.end - stage.start; // in seconds
            const stageMoves = countMovesBetween(relativeMoves, stage.start, stage.end);
            const stageTPS = stageTime > 0 ? stageMoves / stageTime : 0;
            stagesHtml += this._renderStageBox(stage.label, stageTime, stageMoves, stageTPS);
        }

        const html = `
      <div style="
          background-color: #2e2e2e;
          color: #f0f0f0;
          padding: 20px;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: auto;
      ">
        <h2 style="margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Recent Solve</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 5px 0; font-size: 1rem;text-align:center;">Time</h3>
            <p style="margin: 0; font-size: 0.9rem;text-align:center;">${totalTimeSec.toFixed(2)} s</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 5px 0; font-size: 1rem;text-align:center;">Moves</h3>
            <p style="margin: 0; font-size: 0.9rem;text-align:center;">${totalMoves}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 5px 0; font-size: 1rem;text-align:center;">TPS</h3>
            <p style="margin: 0; font-size: 0.9rem;text-align:center;">${overallTPS.toFixed(2)}</p>
          </div>
        </div>
        <div style="border-top: 1px solid #444; padding-top: 10px;">
          <h3 style="margin: 0 0 10px 0; font-size: 1rem;">Stage Breakdown</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            ${stagesHtml}
          </div>
        </div>
      </div>
    `;

        this.container.innerHTML = html;
    }

    /**
     * Helper to render an individual stage breakdown box.
     *
     * @param {string} label - The stage label (e.g., "Cross", "F1", etc.)
     * @param {number} time - The time for this stage (in seconds)
     * @param {number} moves - The number of moves for this stage
     * @param {number} tps - The turns per second for this stage
     * @returns {string} HTML string for the stage box.
     */
    _renderStageBox(label, time, moves, tps) {
        return `
      <div style="
          flex: 1 1 150px;
          background-color: #3a3a3a;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
      ">
        <h4 style="margin: 0 0 5px 0; font-size: 1rem;">${label}</h4>
        <p style="margin: 4px 0; font-size: 0.85rem;">Time: ${time.toFixed(2)} s</p>
        <p style="margin: 4px 0; font-size: 0.85rem;">Moves: ${moves}</p>
        <p style="margin: 4px 0; font-size: 0.85rem;">TPS: ${tps.toFixed(2)}</p>
      </div>
    `;
    }
}
