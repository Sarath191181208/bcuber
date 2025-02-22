import * as Types from "./types"
import { CFOPCubeSolvingPhase } from "./types"
import { getCrossSolvedColor } from "../../stageFinder/faceletCrossChecker"
import { getF2LPairsSolved } from "../../stageFinder/faceleteF2lChecker"
import { getOLLSolved } from "../../stageFinder/faceletOllChecker"


export class CubeSolvingPhaseEventManager {
  /**
   *  @param {function(Types.CubeEvent): void} onEvent - The callback to be invoked when a new phase is reached.
   */
  constructor(onEvent) {
    this.currentPhase = CFOPCubeSolvingPhase.SCRAMBLED
    this.crossColor = null
    this.lastF2LCount = 0
    this.onEvent = onEvent
  }

  reset() {
    this.currentPhase = CFOPCubeSolvingPhase.SCRAMBLED
    this.crossColor = null
    this.lastF2LCount = 0
  }

  /**
   * @param {string} facelet - The cube's current facelet configuration.
   */
  update(facelet) {
    // If the cube is solved, fire the solved event.
    if (
      facelet ===
      'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
    ) {
      if (this.currentPhase !== CFOPCubeSolvingPhase.SOLVED) {
        this.currentPhase = CFOPCubeSolvingPhase.SOLVED
        this.onEvent({ name: CFOPCubeSolvingPhase.SOLVED, data: null })
      }
      return
    }

    // Check if the cross is solved.
    const tmpCrossColor = getCrossSolvedColor(facelet)
    if (this.currentPhase === CFOPCubeSolvingPhase.SCRAMBLED) {
      if (tmpCrossColor) {
        this.crossColor = tmpCrossColor
        this.currentPhase = CFOPCubeSolvingPhase.CROSS_SOLVED
        this.onEvent({ name: CFOPCubeSolvingPhase.CROSS_SOLVED, data: { color: tmpCrossColor } })
      }
    }

    // Check F2L progress.
    // We consider F2L even if the current phase is CROSS (i.e. if F2L work has begun)
    if (
      this.currentPhase === CFOPCubeSolvingPhase.CROSS_SOLVED ||
      this.currentPhase === CFOPCubeSolvingPhase.F2L_PROGRESS
    ) {
      const f2lStatus = getF2LPairsSolved(facelet, this.crossColor)
      const newPairEvent = this.getF2LPairEvent(f2lStatus)
      if (newPairEvent) {
        this.onEvent({ name: CFOPCubeSolvingPhase.F2L_PROGRESS, data: { count: newPairEvent, f2lSlots: f2lStatus } })
      }
      if (newPairEvent === 4 && this.currentPhase !== CFOPCubeSolvingPhase.OLL) {
        this.currentPhase = CFOPCubeSolvingPhase.OLL
        this.onEvent({ name: CFOPCubeSolvingPhase.F2l_COMPLETE, data: null })
      }
    }

    // Check OLL.
    if (this.currentPhase === CFOPCubeSolvingPhase.OLL) {
      const ollSolved = getOLLSolved(facelet, this.crossColor)
      if (ollSolved) {
        this.currentPhase = CFOPCubeSolvingPhase.PLL
        this.onEvent({ name: CFOPCubeSolvingPhase.OLL, data: null })
      }
    }
  }

  /**
   * Determines a new F2L pair event.
   * @param {import("../../../types").F2LIsSlotSolved | null} f2lSolved 
   * @returns {number|undefined}
   */
  getF2LPairEvent(f2lSolved) {
    if (f2lSolved == null) return
    let prev = this.lastF2LCount ?? 0
    const res =
      +f2lSolved.DBL |
      (+f2lSolved.DFR) << 1 |
      (+f2lSolved.DLF) << 2 |
      (+f2lSolved.DRB) << 3
    const curr = res | prev
    this.lastF2LCount = curr
    if (this.countBin1(prev) === this.countBin1(curr)) return
    return this.countBin1(curr)
  }

  /**
   * @param {number} n
   */
  countBin1(n) {
    return n.toString(2).replace(/0/g, "").length
  }
}