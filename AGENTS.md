# AGENTS.md

## Commands

```bash
npm run dev       # Vite dev server (no typecheck in dev)
npm run build     # tsc -b && vite build (typecheck first, then bundle)
npm run preview   # Serve production build locally
npm test          # vitest run (single run, all test files)
npm run test:watch # vitest (watch mode)
```

No linter or formatter is configured.

## Stack

- **Vite 6** + **React 18** + **TypeScript 5.6**
- **CSS Modules** (`*.module.css`) for scoped styles
- **HTML5 Canvas** for grid rendering (fixed 22px cell size)
- No router, no state library, no UI framework

## Architecture

Entrypoint: `src/main.tsx` → `src/App.tsx`

App owns all state and wires four component areas:
- **Toolbar** — algorithm selector, edit mode, clear/reset
- **GridCanvas** — `<canvas>` with mouse-down/drag interaction
- **ControlBar** — play/pause/step/speed
- **InfoPanel** — stats and legend

### Data flow

```
useGrid (grid state + edit mode)     useAnimation (step playback)
       \                                    /
        → App passes grid + currentStep → GridCanvas
        → GridCanvas calls renderFrame(canvasRenderer.ts)
```

### Key modules

| Directory | Purpose |
|---|---|
| `src/types/` | Shared types: `CellType`, `GridModel`, `AlgorithmStep`, `AlgorithmGenerator`, `AlgorithmFn`, `AlgorithmInfo`, `EditMode` |
| `src/grid/` | `gridModel.ts` — pure immutable grid operations. `gridUtils.ts` — `getNeighbors` (4-directional), `manhattan`, `euclidean` |
| `src/algorithms/` | Generator functions: `astar`, `dijkstra`, `bfs`, `dfs`. Registry in `index.ts` via `getAlgorithm(name)` |
| `src/renderer/` | `canvasRenderer.ts` — `renderFrame(ctx, grid, step, cellSize)` draws one frame |
| `src/hooks/` | `useGrid(rows, cols)` and `useAnimation(grid)` |

## Tests

- **Vitest** with `vitest.config.ts` (separate from `vite.config.ts`, no globals).
- Test files live next to source files: `src/grid/gridModel.test.ts`, `src/algorithms/algorithms.test.ts`, etc.
- Algorithm tests use small grids (5×5) — running against the full 50×25 grid would be slow and unnecessary.

## Algorithms are generators

Every algorithm is a **generator function** `(grid: GridModel) => AlgorithmGenerator`. The `useAnimation` hook calls `run()`, which exhausts the generator eagerly, collecting all `AlgorithmStep[]` into an array. Playback increments `currentStepIndex` via `setInterval`. This means:

- Algorithm code **must not** have side effects — it only yields steps.
- `useAnimation.run()` **blocks synchronously** while collecting steps; for large grids this may briefly freeze the UI (current default is 25×50 = 1250 cells, which is fine).
- Step-backward works by decrementing the index (no history stack needed, just index math).

## Grid conventions

- **Immutable pattern**: grid functions (`setCell`, `toggleWall`, etc.) return a new `GridModel` — always use the returned value.
- **Cell keys**: algorithms use string keys `"${row},${col}"` for Maps/Sets.
- **Default grid**: 25 rows × 50 cols, defined as constants in `App.tsx` (not configurable externally).
- **Cell size**: 22px, defined in `GridCanvas.tsx` (not derived from container).
- **Initial start/goal**: placed at `(midRow, cols/4)` and `(midRow, 3*cols/4)` in `createGrid()`.
- **`start`/`goal` cells cannot be walls** — `toggleWall` only operates on `'empty'` ↔ `'wall'`.
- **`setStart`/`setGoal` refuse walls** — they return the grid unchanged if target is a wall.

## Rendering order matters

`renderFrame` draws layers in this order (later layers paint on top):
1. Grid background (walls)
2. Grid lines
3. Visited cells (cyan, 40% opacity)
4. Frontier cells (yellow, 60% opacity)
5. Current cell (purple)
6. Path line (gold)
7. Start/goal circles (green/red)

## TypeScript strictness

`tsconfig.json` is strict: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`. Unused imports or variables **will fail the build**.

## CSS

- Dark theme background: `#0f172a`, text: `#e5e7eb`
- CSS Modules only — no global stylesheet approach outside of `index.css` (reset + body defaults)

## Agent skills

### Issue tracker

Issues live on GitHub (`gabrielLoff/algorithm-visu`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
