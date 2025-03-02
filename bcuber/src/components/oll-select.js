import { Alg } from "cubing/alg";
import { OLL_ALGS } from "../algs/OLL_ALGS";
import { SelectedOLLALGStore } from "../utils/storage/ollSelected";

export class SelectOLLScreen {
  /**
   * @param {HTMLElement} container - The container element to render the screen in.
   */
  constructor(container) {
    this.container = container;
    this.store = new SelectedOLLALGStore();
    this.render();
  }

  render() {
    const selectedOLL = this.store.loadData();
    const algsHtml = OLL_ALGS.map((alg) => {
      // Determine if this algorithm is currently selected
      const isSelected = selectedOLL[alg.name] ? "selected" : "";
      return `
        <div class="oll-option ${isSelected}" data-value="${alg.name}" class="${
        isSelected ? "selected" : ""
      }">
          <twisty-player 
            alg="${new Alg(alg.setup).invert()}" 
            experimental-setup-anchor="end" 
            experimental-stickering="OLL"
            visualization="experimental-2D-LL"
            background="none" 
            control-panel="none">
          </twisty-player>
          ${alg.name}
          ${alg.subgroup ? `<span class="subgroup">${alg.subgroup}</span>` : ""}
          ${alg.setup}
        </div>
      `;
    }).join("");

    this.container.innerHTML = algsHtml;
    this.attachClickEvents();
  }

  attachClickEvents() {
    // Add a click event listener to each option
    const options = this.container.querySelectorAll(".oll-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const algId = option.getAttribute("data-value");
        if (!algId) throw new Error("Algorithm ID not found");
        this.toggleSelection(algId);
      });
    });
  }

  /**
   * Toggle the selection for the given algorithm.
   * @param {string} algId - The id of the algorithm to toggle.
   */
  toggleSelection(algId) {
    console.log({ algId });
    // Retrieve current selection state
    const data = this.store.loadData();
    let currentSelection = true;
    if (data) {
      currentSelection = data[algId] || false;
    }
    // Update the store with the toggled selection
    this.store.setALG(algId, !currentSelection);
    // Update the UI to reflect the new selection state
    this.render();
  }
}
