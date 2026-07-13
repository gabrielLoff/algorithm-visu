# Code Review Findings

From code-clarity-reviewer, [date TBD].

## Major

- [ ] **Extract duplicated `reconstructPath`** — Identical function in `astar.ts`, `dijkstra.ts`, `bfs.ts`, `dfs.ts`. Extract to a shared module (e.g. `src/algorithms/pathUtils.ts`).
- [ ] **Extract cell key helpers** — `cellKey(pos)` and `parseCellKey(key)` used across all 4 algorithms. Centralize in `src/grid/gridUtils.ts`.
- [ ] **Standardize visited/frontier display-list computation** — A*, Dijkstra, BFS, and DFS each compute the `visited` array differently for display purposes. Extract a shared `computeDisplayLists(explored, frontier, currentKey)` helper. BFS/DFS also use O(n^2) linear scans for this (`.some()` calls).

## Minor

- [ ] **Remove `createGrid` alias in `useGrid.ts`** — `import { createGrid as makeGrid }` adds confusion. Use the original name.
- [ ] **Extract animation delay magic numbers** — `200 - speed * 1.9` in `useAnimation.ts:53`. Replace with named constants (`MAX_DELAY_MS`, `SPEED_SCALE`, `MIN_DELAY_MS`).
- [ ] **Fix stale closure in `handleReset`** — Reads `grid` from closure, but `resetGridFn` ignores input. Use functional updater: `setGrid((prev) => resetGridFn(prev))` with empty deps.
- [ ] **Share color constants** — Colors in `canvasRenderer.ts` and `InfoPanel.tsx` are duplicated. Move to `src/constants/colors.ts`.
- [ ] **Remove dead `isDone` prop from `InfoPanel`** — Declared in interface and passed from `App.tsx`, but never destructured or used.
- [ ] **Simplify `algorithmInfo` conditional in `App.tsx`** — Double-conditions `animation.algorithmName ? algorithmInfo : null`. Extract into a named variable with a comment explaining the intent.

## Suggestion

- [ ] **Rename `clearInterval_` to `stopTimer`** — Trailing underscore is unclear. A descriptive name communicates intent.
- [ ] **Replace `let` with `const` in `gridModel.ts`** — `cells` in `setStart` and `setGoal` is never reassigned.
- [ ] **Remove unnecessary `as CellType` cast** — In `clearWalls`, `'empty'` already satisfies `CellType`.
- [ ] **Rename `drawGridBackground` to `drawWalls`** — Function only renders walls, not the full background.
- [ ] **Use label map for mode buttons in `Toolbar.tsx`** — `m.charAt(0).toUpperCase() + m.slice(1)` couples display to internal value. Use `Record<EditMode, string>`.
- [ ] **Remove `useCallback` wrapper on `setSpeed`** — `setSpeedState` is already stable. The wrapper adds indirection.
- [ ] **Add JSDoc to `renderFrame`** — Clarify that `grid` provides static cell state and `step` provides dynamic algorithm state.
