# 01 — Extract shared pathfinding utilities

**What to build:** Extract three duplicated concerns from all four algorithm files into shared modules so a future change to path reconstruction, cell-key handling, or display-list computation only needs to happen in one place.

- Move `reconstructPath` into a shared module (`src/algorithms/pathUtils.ts`) and import it in `astar.ts`, `dijkstra.ts`, `bfs.ts`, `dfs.ts`.
- Add `cellKey(pos)` and `parseCellKey(key)` helpers to `src/grid/gridUtils.ts`. Replace every manual `${row},${col}` construction and `key.split(',').map(Number)` parse with calls to these helpers across all algorithm files.
- Extract a shared `computeDisplayLists(explored, frontierSet, currentKey)` helper that produces the `visited` and `frontier` arrays for display. Apply it in all four algorithms. Replace the O(n^2) `.some()` frontier-exclusion scans in BFS and DFS with O(1) Set lookups.

All existing tests must continue to pass.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] All 57 existing tests pass after the refactor
- [ ] `reconstructPath` is defined in exactly one file and imported by the four algorithms
- [ ] No algorithm file contains a `${row},${col}` or `key.split(',')` string — all cell-key marshalling goes through the helpers
- [ ] `computeDisplayLists` replaces the ad-hoc visited/frontier array construction in every algorithm
- [ ] BFS and DFS visited-exclusion uses Set semantics, not array `.some()`
