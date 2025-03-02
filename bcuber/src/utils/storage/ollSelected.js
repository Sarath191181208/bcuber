import { AbstractStorage } from "./abstractStorage";

export class SelectedOLLALGStore extends AbstractStorage {
  constructor() {
    super("selectedOLLALGS");
    this.selectedALGS = this.loadSelectedOLLALGS();
  }

  /**
   * @returns {{[key: string]: boolean}}
   */
  loadSelectedOLLALGS() {
    const savedData = this.loadData();
    if (savedData) {
      return savedData;
    }
    return {};
  }

  /**
   * @param {{[key: string]: boolean}} selectedALGS
   */
  saveData(selectedALGS) {
    localStorage.setItem(this.key, JSON.stringify(selectedALGS));
  }

  /**
   * @param {string} oll
   * @param {boolean} alg
   */
  setALG(oll, alg) {
    this.selectedALGS[oll] = alg;
    this.saveData(this.selectedALGS);
  }
}
