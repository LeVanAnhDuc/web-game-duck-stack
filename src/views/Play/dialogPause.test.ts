import { describe, expect, it } from 'vitest'

import type { Phase } from '@/engine'

import { shouldAutoPause } from './dialogPause'

const ALL_PHASES: Phase[] = ['playing', 'lineClearDelay', 'gameOver', 'paused']

/**
 * Opening a dialog over a running round pauses it; closing it has to undo exactly
 * that and nothing more.
 *
 * The bug this locks was not a wrong condition -- it was TWO conditions. Opening
 * asked "is the round running?" before pausing; closing asked nothing and simply
 * unmounted, so the player landed on the paused modal they never asked for. Three
 * personas hit it in one review round (ux-reviews/2026-09-12). One predicate now
 * answers both halves, so they cannot drift apart again. ADR-0017.
 */
describe('shouldAutoPause', () => {
  it('pauses a round that is actually running', () => {
    expect(shouldAutoPause('playing')).toBe(true)
    // lineClearDelay is mid-round too: rows are collapsing, gravity resumes after.
    expect(shouldAutoPause('lineClearDelay')).toBe(true)
  })

  it('leaves a round the player paused themselves alone', () => {
    // Opening settings from the paused modal must NOT send a second pause, and
    // closing must NOT resume -- the player asked for that pause and is owed it back.
    expect(shouldAutoPause('paused')).toBe(false)
  })

  it('leaves a finished round alone', () => {
    // High scores opens from the game-over modal. Resuming a dead round on close
    // would hand back a board that cannot be played.
    expect(shouldAutoPause('gameOver')).toBe(false)
  })

  it('answers for every phase the engine can be in', () => {
    // If a new phase is ever added, this fails until someone decides which side it
    // belongs on -- rather than defaulting to "pause it" and surprising the player.
    for (const phase of ALL_PHASES) {
      expect(typeof shouldAutoPause(phase)).toBe('boolean')
    }
    expect(ALL_PHASES.filter(shouldAutoPause)).toEqual(['playing', 'lineClearDelay'])
  })
})
