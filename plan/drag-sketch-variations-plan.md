# Drag-based "sketch" hero — variations plan

## What Kamil asked for

Keep the system-design-doc theme (paper / ink / burnt orange / mint, Space Grotesk +
JetBrains Mono) but make the hero behave like a sketch on a whiteboard: every element
in the architecture diagram (root node, three service nodes, contact CTA, both notes)
should be draggable, and the connectors should redraw live so it still reads as a
system diagram. Today only the two notes are draggable, clamped to +-70px, and the
connectors are static absolutely-positioned divs.

Deliverable for this round: an interactive prototype page with several variations
that can be flicked through (tabs + arrow keys). Kamil picks one, then it gets
implemented in `src/components/Hero.astro`.

## Variations

1. **Whiteboard** — hand-drawn feel. Rough (SVG-displaced) card edges, sketchy
   double-stroke curved connectors with hand-drawn arrowheads, handwritten (Caveat)
   annotations on the notes, free drag with a paper tilt, ghost outline where the
   node came from, and a pen tool so visitors can scribble on the doc (undo / clear).
2. **Blueprint** — diagram-editor feel. Snap to the 22px dot grid, orange alignment
   guides that snap to other nodes' edges/centres, orthogonal elbow connectors with
   ports and GET/POST edge labels, animated packets, selection handles with a
   coordinate readout, status bar, reset + snap toggle.
3. **Live wire** — physical feel. Connectors are sagging springy cables; dragging a
   node tugs its neighbours, release settles with damping, flinging glides. Mint
   health-check pulses travel root -> services and update a `200 OK · Nms` readout.
   Pinned notes. A chaos-monkey button jolts the graph and flips the root to
   DEGRADED until it settles.

Shared across all three: same DOM content as today's hero, click-vs-drag threshold so
the service links still navigate, arrow-key nudging for focused nodes, reset layout,
reduced-motion respected, mobile keeps the current stacked flow.

## Implementation notes for the chosen variation (later)

- Replace the absolute-positioned connector divs with one SVG overlay in the stage.
- Nodes: `position:absolute; left:0; top:0; transform: translate(var(--x), var(--y))`
  with positions computed from the stage width on init/resize.
- Shared drag controller (pointer capture, click threshold, keyboard nudge).
- Keep landing cascade animations; they are independent of position.
