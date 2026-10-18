import type { Phase } from '@/engine'

/**
 * Whether opening a dialog over the round has to pause it first -- and therefore
 * whether closing that dialog has to resume it.
 *
 * One predicate for both halves on purpose. Opening used to carry this condition
 * while closing carried none, so a player who opened settings from the top bar was
 * handed the paused modal on the way out instead of the round they left. Reading
 * sliders while pieces fall is still a trap, so the pause stays -- it is the return
 * trip that was missing.
 *
 * Reasoning and rejected alternatives: ADR-0017.
 */
export function shouldAutoPause(phase: Phase): boolean {
  return phase !== 'paused' && phase !== 'gameOver'
}
