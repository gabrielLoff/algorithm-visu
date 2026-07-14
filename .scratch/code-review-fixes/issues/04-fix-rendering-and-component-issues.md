# 04 — Fix rendering and component issues

**What to build:** Fix several clarity issues across the renderer and components.

- Move color constants from `canvasRenderer.ts` and `InfoPanel.tsx` into a shared module (`src/constants/colors.ts`). Import from there in both files so the renderer and legend stay in sync.
- Rename `drawGridBackground` to `drawWalls` in `canvasRenderer.ts` — it only renders wall cells, not the full background.
- Add a JSDoc comment on `renderFrame` explaining that `grid` provides static cell state and `step` provides dynamic algorithm state.
- Remove the dead `isDone` prop from `InfoPanelProps` — it is declared in the interface and passed from `App.tsx` but never destructured or used.
- Simplify the `algorithmInfo` conditional in `App.tsx`: extract the guard `animation.algorithmName ? algorithmInfo : null` into a clearly named variable with a comment.
- In `Toolbar.tsx`, replace the inline `m.charAt(0).toUpperCase() + m.slice(1)` label construction with an explicit `Record<EditMode, string>` map so display labels are decoupled from internal enum values.

All existing behavior must be preserved.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `src/constants/colors.ts` exists and is the single source of truth for grid colors
- [ ] `canvasRenderer.ts` and `InfoPanel.tsx` import colors from the shared module
- [ ] `drawWalls` replaces `drawGridBackground`
- [ ] `renderFrame` has a JSDoc describing the two-parameter role split
- [ ] `isDone` removed from `InfoPanelProps` interface and `App.tsx` prop passing
- [ ] `algorithmInfo` conditional in `App.tsx` uses a named variable with a comment
- [ ] `Toolbar.tsx` mode buttons use a label map instead of string manipulation
