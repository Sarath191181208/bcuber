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
    (m) => m.timestamp / 1000 >= startSec && m.timestamp / 1000 < endSec
  ).length;
};

/**
 * RecentSolveView component displays detailed info for one solve.
 * It shows overall metrics (Time, Moves, TPS) and a breakdown for each stage:
 * Cross, F2L (with individual sub-stages F1, F2, F3, F4 and an overall F2L stats box below),
 * OLL, and PLL.
 *
 * Assumptions:
 * - s.checkpoints is an array of 7 numbers in seconds:
 *   [Cross, F1, F2, F3, F4, OLL, PLL]
 *   where:
 *     • Cross: from 0 to cps[0]
 *     • F2L: from cps[0] to cps[4]
 *         (F1 = cps[1]-cps[0], F2 = cps[2]-cps[1], F3 = cps[3]-cps[2], F4 = cps[4]-cps[3])
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
    if (s === undefined) {
      return;
    }

    // Validate required data.
    if (
      !s.startTime ||
      !s.endTime ||
      !s.checkpoints ||
      s.checkpoints.length < 7
    ) {
      this.container.innerHTML = `<p style="color: #ccc;">No valid solve data available.</p>`;
      return;
    }

    // Overall metrics.
    const totalTimeSec = (s.endTime - s.startTime) / 1000;
    const totalMoves = s.moves.length;
    const overallTPS = totalTimeSec > 0 ? totalMoves / totalTimeSec : 0;

    const cps = s.checkpoints;
    const relativeMoves = s.convertTimestampsToRelative();
    if (!relativeMoves) {
      this.container.innerHTML = `<p style="color: #ccc;">No valid solve data available.</p>`;
      return;
    }

    // Cross: from 0 to cps[0]
    const crossTime = cps[0];
    const crossMoves = countMovesBetween(relativeMoves, 0, cps[0]);
    const crossTPS = crossTime > 0 ? crossMoves / crossTime : 0;

    // F2L sub-stages:
    const f1Time = cps[1] - cps[0];
    const f1Moves = countMovesBetween(relativeMoves, cps[0], cps[1]);
    const f1TPS = f1Time > 0 ? f1Moves / f1Time : 0;

    const f2Time = cps[2] - cps[1];
    const f2Moves = countMovesBetween(relativeMoves, cps[1], cps[2]);
    const f2TPS = f2Time > 0 ? f2Moves / f2Time : 0;

    const f3Time = cps[3] - cps[2];
    const f3Moves = countMovesBetween(relativeMoves, cps[2], cps[3]);
    const f3TPS = f3Time > 0 ? f3Moves / f3Time : 0;

    const f4Time = cps[4] - cps[3];
    const f4Moves = countMovesBetween(relativeMoves, cps[3], cps[4]);
    const f4TPS = f4Time > 0 ? f4Moves / f4Time : 0;

    // Overall F2L stats: from cps[0] to cps[4]
    const overallF2LTime = cps[4] - cps[0];
    const overallF2LMoves = countMovesBetween(relativeMoves, cps[0], cps[4]);
    const overallF2LTPS =
      overallF2LTime > 0 ? overallF2LMoves / overallF2LTime : 0;

    // OLL: from cps[4] to cps[5]
    const ollTime = cps[5] - cps[4];
    const ollMoves = countMovesBetween(relativeMoves, cps[4], cps[5]);
    const ollTPS = ollTime > 0 ? ollMoves / ollTime : 0;

    // PLL: from cps[5] to cps[6]
    const pllTime = cps[6] - cps[5];
    const pllMoves = countMovesBetween(relativeMoves, cps[5], cps[6]);
    const pllTPS = pllTime > 0 ? pllMoves / pllTime : 0;

    const html = `
      <div style="
          background-color: #1e1e1e;
          color: #f0f0f0;
          padding: 20px;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: auto;
      ">
        <h2 style="margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 10px; text-align: center;">
          Recent Solve
        </h2>
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
        ${renderStats({ totalTimeSec, totalMoves, overallTPS })}
        </div>
        <div>
          <h3 style="border-bottom: 1px solid #444; padding-bottom: 10px;">Stage Breakdown</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-around;">
            ${this._renderBigStageBox("Cross", crossTime, crossMoves, crossTPS)}
            <div style="flex: 1 1 300px;">
              <div style="display: flex; gap: 10px; justify-content: space-around; flex-wrap: nowrap;">
                ${this._renderSmallStageBox("F1", f1Time, f1Moves, f1TPS)}
                ${this._renderSmallStageBox("F2", f2Time, f2Moves, f2TPS)}
                ${this._renderSmallStageBox("F3", f3Time, f3Moves, f3TPS)}
                ${this._renderSmallStageBox("F4", f4Time, f4Moves, f4TPS)}
              </div>
              <div style="margin-top: 10px;">
                ${this._renderBigStageBox(
                  "F2L Overall",
                  overallF2LTime,
                  overallF2LMoves,
                  overallF2LTPS
                )}
              </div>
            </div>
            ${this._renderBigStageBox("OLL", ollTime, ollMoves, ollTPS)}
            ${this._renderBigStageBox("PLL", pllTime, pllMoves, pllTPS)}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Renders a big stage box.
   * The heading is the stage name and the main text is the time (displayed prominently).
   * Moves and TPS are displayed on a separate, smaller line below.
   *
   * @param {string} label - The stage label.
   * @param {number} time - Time in seconds.
   * @param {number} moves - Number of moves.
   * @param {number} tps - Turns per second.
   * @returns {string} HTML string.
   */
  _renderBigStageBox(label, time, moves, tps) {
    return `
      <div style="
          flex: 1 1 150px;
          background-color: #262626;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      ">
        <h4 style="margin: 0 0 10px 0;">${label}</h4>
        <div style="font-size: 2rem; font-weight: bold; margin-bottom: 5px; white-space: nowrap;">
          ${time.toFixed(2)} s
        </div>
        <div style="font-size: 0.8rem; color: #ccc;">
          Moves: ${moves} | TPS: ${tps.toFixed(2)}
        </div>
      </div>
    `;
  }

  /**
   * Renders a small stage box for individual F2L sub-stages.
   * The heading is the sub-stage label and the main text is the time.
   * Moves and TPS are shown below in a smaller font.
   *
   * @param {string} label - The sub-stage label (e.g., "F1").
   * @param {number} time - Time in seconds.
   * @param {number} moves - Number of moves.
   * @param {number} tps - Turns per second.
   * @returns {string} HTML string.
   */
  _renderSmallStageBox(label, time, moves, tps) {
    return `
      <div style="
          flex: 1 1 70px;
          background-color: #282828;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      ">
        <h5 style="margin: 0 0 8px 0; font-size: 0.9rem;">${label}</h5>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 3px; white-space: nowrap;">
          ${time.toFixed(2)} s
        </div>
        <div style="font-size: 0.7rem; color: #ccc;">
          ${moves} moves, ${tps.toFixed(2)} TPS
        </div>
      </div>
    `;
  }
}

/**
 *
 * @param {Object} arg0
 * @param {number} arg0.totalTimeSec
 * @param {number} arg0.totalMoves
 * @param {number} arg0.overallTPS
 * @returns
 */
function renderStats({ totalTimeSec, totalMoves, overallTPS }) {
  return /*html*/ `
          <div style="text-align: center;">
            <h3 style="margin: 0; font-size: 1.1rem;">Time</h3>
            <p style="margin: 0;">${totalTimeSec.toFixed(2)} s</p>
          </div>
          <div style="text-align: center;">
            <h3 style="margin: 0; font-size: 1.1rem;">Moves</h3>
            <p style="margin: 0;">${totalMoves}</p>
          </div>
          <div style="text-align: center;">
            <h3 style="margin: 0; font-size: 1.1rem;">TPS</h3>
            <p style="margin: 0;">${overallTPS.toFixed(2)}</p>
          </div>
        `;
}

export class SinglePhaseRecentSolveView {
  /**
   * @param {HTMLElement} container - The container element where the view will be rendered.
   * @param {SolveData} solveData - The solve data object.
   */
  constructor(container, solveData) {
    this.container = container;
    this.solveData = solveData;
  }

  /**
   * @param {string[]} F2LAlgs
   */
  render(F2LAlgs) {
    const s = this.solveData;
    if (s === undefined) {
      return;
    }

    const relativeMoves = s.convertTimestampsToRelative();
    if (!relativeMoves || relativeMoves.length === 0) {
      this.container.innerHTML = `<p style="color: #ccc;">No valid solve data available.</p>`;
      return;
    }

    // Overall metrics. There is only one total time for the solve.
    const totalTimeSec = (s.endTime - s.startTime) / 1000;
    const totalMoves = s.moves.length;
    const totalTPS = totalTimeSec > 0 ? totalMoves / totalTimeSec : 0;

    const inspectionTime = (s.moves[0].timestamp - s.startTime) / 1000;
    const executionTime = totalTimeSec - inspectionTime;

    // Render solution moves in a horizontal block above the timeline.
    const solutionMovesHTML = `
      <div style="
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 20px;
      ">
        ${relativeMoves
          .map((move, index) => {
            return `<span id="move-${index}" style="
                      padding: 8px 12px;
                      margin: 6px;
                      border-radius: 6px;
                      font-size: 1rem;
                      transition: background-color 0.2s;
                      background-color: transparent;
                    ">
                      ${move.move} (${(move.timestamp / 1000).toFixed(2)} s)
                    </span>`;
          })
          .join(" ")}
      </div>
    `;

    // Build timeline HTML: a horizontal line with a dot for every move.
    // Each dot is positioned based on the move's timestamp, and hovering it
    // will highlight the corresponding move above.
    const timelineHTML = `
      <div style="position: relative; height: 70px; margin: 20px 0;">
        <div style="
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          border-top: 2px solid #ccc;
        "></div>
        ${relativeMoves
          .map((move, index) => {
            const leftPercent = (move.timestamp / 1000 / totalTimeSec) * 100;
            const diffSec =
              index === 0
                ? (move.timestamp / 1000).toFixed(2)
                : (
                    (move.timestamp - relativeMoves[index - 1].timestamp) /
                    1000
                  ).toFixed(2);
            return `<div style="
                        position: absolute;
                        top: 50%;
                        left: ${leftPercent}%;
                        transform: translate(-50%, -50%);
                      ">
                        <div style="
                          width: 14px;
                          height: 14px;
                          background-color: #f0f0f0;
                          border-radius: 50%;
                          cursor: pointer;
                          transition: background-color 0.2s;
                        "
                          onmouseenter="document.getElementById('move-${index}').style.backgroundColor='#555';"
                          onmouseleave="document.getElementById('move-${index}').style.backgroundColor='transparent';"
                          title="${move.move} - ${diffSec}s">
                        </div>
                      </div>`;
          })
          .join("")}
      </div>
    `;

    // Render scramble if available.
    const scrambleHTML = s.scramble
      ? `
      <div style="
        border-top: 2px solid #444;
        margin-top: 20px;
        padding-top: 15px;
      ">
        <h3 style="text-align: center; margin-bottom: 10px;">Scramble</h3>
        <p style="
          text-align: center;
          font-family: monospace;
          font-size: 1.1rem;
        ">${s.scramble}</p>
      </div>
      `
      : "";

    // Render F2L algorithms.
    const algorithmsHTML = `
      <div style="
        border-top: 1px solid #444;
        margin-top: 20px;
        padding-top: 15px;
      ">
        <h3 style="text-align: center; margin-bottom: 10px;">F2L Algorithms</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${F2LAlgs.map(
            (alg) => `
                <li style="
                    background-color: #282828;
                    padding: 20px 15px;
                    margin: 8px 0;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 1rem;
                ">${alg}</li>
              `
          ).join("")}
        </ul>
      </div>
    `;

    const html = /*html*/ `
      <div style="
          background-color: #1e1e1e;
          color: #f0f0f0;
          padding: 30px;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: auto;
      ">
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
          <div style="text-align: center;">
            <h3 style="margin: 0; font-size: 1.1rem;">Inspection</h3>
            <p style="margin: 0;">${inspectionTime.toFixed(2)} s</p>
          </div>

          <div style="text-align: center;">
            <h3 style="margin: 0; font-size: 1.1rem;">Execution</h3>
            <p style="margin: 0;">${executionTime.toFixed(2)} s</p>
          </div>

          ${renderStats({ totalTimeSec, totalMoves, overallTPS: totalTPS })}
        </div>
        ${scrambleHTML}
        <div style="
          border-top: 2px solid #444;
          margin-top: 20px;
          padding-top: 20px;
        ">
          <h3 style="text-align: center; margin-bottom: 15px;">Solution Moves</h3>
          ${solutionMovesHTML}
          ${timelineHTML}
        </div>
        ${algorithmsHTML}
      </div>
    `;

    this.container.innerHTML = html;
  }
}
