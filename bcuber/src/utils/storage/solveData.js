import { SolveData } from "../solveData";

export class SolveDataStorage {
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
        return jsonParsed.map((s) => {
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
