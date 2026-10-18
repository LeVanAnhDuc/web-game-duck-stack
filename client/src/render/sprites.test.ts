import { describe, expect, it } from 'vitest'

import { KINDS } from '../engine'
import { CB_FILL, CB_LETTER, cellFace, PIECE_COLORS } from './sprites'

/**
 * `cellFace` is the one place that decides what a cell of a given kind looks like.
 *
 * It exists because the board and the two previews (hold, next queue) are drawn by
 * different technologies -- canvas for the board, DOM for the previews (ADR-0012) --
 * and they drifted: colour-blind mode reached the canvas and never reached the
 * previews. The drift was invisible to every existing test because no test could see
 * a colour, and invisible on the board itself because the board looked correct.
 *
 * So these tests do not check "does the canvas work". They check the contract both
 * call sites read, which is the only thing that keeps them in step (ADR-0017).
 */
describe('cellFace', () => {
  it('gives every kind its own colour in normal mode, and no letter', () => {
    for (const kind of KINDS) {
      expect(cellFace(kind, false)).toEqual({ fill: PIECE_COLORS[kind], letter: null })
    }
  })

  it('gives every kind the SAME fill in colour-blind mode', () => {
    const fills = new Set(KINDS.map((kind) => cellFace(kind, true).fill))
    // One fill for all seven: in this mode colour carries nothing at all, which is
    // the point. MASTER.md measured T vs Z at 1.20:1 -- for a player who cannot
    // separate those hues they are already the same piece, so desaturating all of
    // them loses nothing and stops the eye looking for a signal that is not there.
    expect(fills).toEqual(new Set([CB_FILL]))
  })

  it('gives every kind its letter in colour-blind mode', () => {
    for (const kind of KINDS) {
      expect(cellFace(kind, true).letter).toBe(kind)
    }
  })

  it('makes the letter the ONLY thing that separates two kinds in colour-blind mode', () => {
    // The regression this locks: a surface that reads `fill` but not `letter` shows
    // seven identical grey cells. That is worse than the coloured original, so a
    // call site may not take half of this contract.
    for (const a of KINDS) {
      for (const b of KINDS) {
        if (a === b) continue
        const fa = cellFace(a, true)
        const fb = cellFace(b, true)
        expect(fa.fill).toBe(fb.fill)
        expect(fa.letter).not.toBe(fb.letter)
      }
    }
  })

  it('keeps the letter readable against the fill it sits on', () => {
    // Not a contrast calculation -- just the two constants being distinct and both
    // defined, so a later edit cannot leave the letter painted onto its own ground.
    expect(CB_LETTER).not.toBe(CB_FILL)
    expect(CB_FILL).toMatch(/^#[0-9A-Fa-f]{6}$/)
    expect(CB_LETTER).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
