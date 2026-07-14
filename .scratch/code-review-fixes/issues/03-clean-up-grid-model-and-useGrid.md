# 03 — Clean up grid model and useGrid

**What to build:** Fix minor clarity issues in `gridModel.ts` and `useGrid.ts`.

- Replace `let cells = ...` with `const cells = ...` in `setStart` and `setGoal` — the variable is never reassigned.
- Remove the unnecessary `as CellType` cast in `clearWalls` — the string literal `'empty'` already satisfies the type.
- In `useGrid.ts`, import `createGrid` under its actual name instead of aliasing it to `makeGrid`.
- In `useGrid.ts` `handleReset`, switch to the functional updater form `setGrid((prev) => resetGridFn(prev))` with an empty dependency array — `resetGridFn` ignores its input anyway, so the `grid` closure dependency is misleading.

All existing tests must continue to pass.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `const` used for `cells` in `setStart` and `setGoal` (`gridModel.ts`)
- [ ] No `as CellType` cast in `clearWalls`
- [ ] `createGrid` imported without an alias in `useGrid.ts`
- [ ] `handleReset` uses `setGrid((prev) => resetGridFn(prev))` with empty deps array
- [ ] All 57 tests pass
