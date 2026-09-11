import { shapeOf, type Kind } from '@/engine'
import { BEVEL_DARK, BEVEL_LIGHT, CB_LETTER, cellFace } from '@/render/sprites'

/**
 * The hold slot and the next queue (FR-04, FR-05).
 *
 * These are DOM rather than canvas: they change once per piece, not per frame, so
 * they belong to React. Same bevel as the board cells (ADR-0009), because a flat
 * swatch next to a bevelled board reads as a different material.
 *
 * `colorBlind` is not a style flag, it is the same contract the board obeys: both
 * surfaces read `cellFace` so they cannot disagree about what a piece looks like
 * (FR-26, NFR-A11Y-06, ADR-0017). Passed in rather than read from context because
 * this component stays presentational -- the board's renderer is told the same way.
 */

const MATRIX = 4
const ROWS = 2

export function PiecePreview({
  kind,
  cell,
  colorBlind = false,
}: {
  kind: Kind | null
  cell: number
  colorBlind?: boolean
}) {
  const bevel = cell >= 20 ? 2 : 1
  const cells = kind ? shapeOf(kind, 0).cells : []
  // Normalise so a 3-wide piece is not glued to the left edge of a 4-wide box.
  const cols = cells.map(([c]) => c)
  const rows = cells.map(([, r]) => r)
  const minCol = cols.length > 0 ? Math.min(...cols) : 0
  const minRow = rows.length > 0 ? Math.min(...rows) : 0
  const width = cols.length > 0 ? Math.max(...cols) - minCol + 1 : 0
  const offset = Math.floor((MATRIX - width) / 2)

  const filled = new Set(cells.map(([c, r]) => `${c - minCol + offset},${r - minRow}`))
  const face = kind !== null ? cellFace(kind, colorBlind) : null

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${MATRIX}, ${cell}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${cell}px)`,
        gap: 1,
      }}
    >
      {Array.from({ length: MATRIX * ROWS }, (_, i) => {
        const c = i % MATRIX
        const r = Math.floor(i / MATRIX)
        const on = kind !== null && filled.has(`${c},${r}`)
        return (
          <div
            key={i}
            style={
              on && face
                ? {
                    background: face.fill,
                    borderRadius: 2,
                    boxShadow: `inset ${bevel}px ${bevel}px 0 ${BEVEL_LIGHT}, inset -${bevel}px -${bevel}px 0 ${BEVEL_DARK}`,
                    // The letter, when colour is not carrying the meaning. Scaled to
                    // the cell like the canvas stamp, and never below 7px -- the
                    // next queue draws at cell 9, so a fixed size would either
                    // overflow the hold slot or vanish here.
                    ...(face.letter !== null && {
                      color: CB_LETTER,
                      font: `600 ${Math.max(7, Math.round(cell * 0.6))}px var(--font-mono, ui-monospace, monospace)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }),
                  }
                : undefined
            }
          >
            {on && face?.letter !== null ? face?.letter : null}
          </div>
        )
      })}
    </div>
  )
}
