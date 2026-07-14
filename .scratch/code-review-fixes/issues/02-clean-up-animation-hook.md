# 02 — Clean up animation hook

**What to build:** Improve readability of `useAnimation.ts` by extracting magic numbers and renaming for clarity.

- Extract the delay formula `200 - speed * 1.9` into named constants: `MAX_DELAY_MS = 200`, `SPEED_SCALE = 1.9`, `MIN_DELAY_MS = 10`. Replace the inline expression.
- Rename `clearInterval_` to `stopTimer` throughout the file — the trailing-underscore convention obscures what the function does.
- Drop the unnecessary `useCallback` wrapper on `setSpeed` — `setSpeedState` (from `useState`) is already a stable function. Return it directly or use a plain arrow function.

All existing behavior must be preserved.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Delay calculation uses `MAX_DELAY_MS`, `SPEED_SCALE`, `MIN_DELAY_MS` constants
- [ ] `clearInterval_` renamed to `stopTimer` in all references
- [ ] `setSpeed` no longer wrapped in a `useCallback` with empty deps
- [ ] Playback behaves identically (same speed range, same timing)
