//@ts-check

import { CubeTimer } from "../components/cubeTimer";

export class SolveData {
    /**
     * @param {string} scramble
     */
    constructor(scramble) {
        this.scramble = scramble;   // The scramble string used for the solve
        this.moves = [];            // Array of { move: string, timestamp: number }
        this.checkpoints = [];      // Array of { checkpoint: string, timestamp: number }
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
        let html = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 4px;">Cross</th>
            <th style="border: 1px solid #ccc; padding: 4px;">F2L1</th>
            <th style="border: 1px solid #ccc; padding: 4px;">F2L2</th>
            <th style="border: 1px solid #ccc; padding: 4px;">F2L3</th>
            <th style="border: 1px solid #ccc; padding: 4px;">F2L4</th>
            <th style="border: 1px solid #ccc; padding: 4px;">OLL</th>
            <th style="border: 1px solid #ccc; padding: 4px;">PLL</th>
          </tr>
        </thead>
        <tbody>
    `;

        this.solves.forEach(s => {
            // Assume s.checkpoints is an array of times in ms from the start.
            const checkpoints = s.checkpoints || [];
            const crossTime = checkpoints[0];
            const f2l1 = checkpoints[1] - checkpoints[0]
            const f2l2 = checkpoints[2] - checkpoints[1]
            const f2l3 = checkpoints[3] - checkpoints[2]
            const f2l4 = checkpoints[4] - checkpoints[3]
            const oll = checkpoints[5] - checkpoints[4]
            const pll = checkpoints[6] - checkpoints[5]

            html += /*html*/`
        <tr>
          <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${crossTime.toFixed(2)}</td>
          <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${f2l1.toFixed(2)}</td>
          <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${f2l2.toFixed(2)}</td>
          <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${f2l3.toFixed(2)}</td>
          <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${f2l4.toFixed(2)}</td>
          <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${oll.toFixed(2)}</td>
            <td style="border: 1px solid #ccc; padding: 4px; font-size: 0.8em;">${pll.toFixed(2)}</td>
        </tr>
      `;
        });

        html += `
        </tbody>
      </table>
    `;
        if (this.solves.length === 0) {
            html = `<p style='text-align: center; color: #383838'>No solves yet.</p>`;
            this.container.innerHTML = html;
            return;
        }
        this.container.innerHTML = html;
    }
}

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
     * @returns {Array} Array of saved solve objects.
     */
    loadSolves() {
        const savedSolves = localStorage.getItem(this.key);
        if (savedSolves) {
            try {
                return JSON.parse(savedSolves);
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
