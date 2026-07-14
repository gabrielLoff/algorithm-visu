# Sorting Algorithm Visualizer

## Context

The app supports a single visualizer category (pathfinding). We're adding a second: list sorting algorithms. The architecture is extended with domain-specific types (not generics), parallel to pathfinding, following ADR-0004.

## Phases

### Phase 1 — Prefactor: rename pathfinding types (#45)

- `AlgorithmFn` → `PathfindingAlgorithmFn`
- `AlgorithmStep` → `PathfindingAlgorithmStep`
- `AlgorithmGenerator` → `PathfindingAlgorithmGenerator`
- `AlgorithmInfo` → `PathfindingAlgorithmInfo`
- All imports updated across the codebase

### Phase 2 — Prefactor: move pathfinding files (#46)
- `src/algorithms/*.ts` → `src/algorithms/pathfinding/`
- Blocked by #45

### Phase 3 — Sorting types (#47)
- `SortingAlgorithmStep { array: number[]; compared: [number, number]; swapped: [number, number] | null; done: boolean }`
- `SortingAlgorithmFn = (array: number[]) => SortingAlgorithmGenerator`
- `SortingAlgorithmGenerator = Generator<SortingAlgorithmStep, void, undefined>`
- `SortingAlgorithmInfo { name, fn, description }`
- Registry at `src/algorithms/sorting/index.ts`

### Phase 4 — Sorting algorithms (#48)
- 8 algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Radix
- Generator functions yielding `SortingAlgorithmStep`
- Blocked by #47

### Phase 5 — useSortingAnimation hook (#49)
- Fork of `useAnimation` for sorting domain
- Same API surface: run, play, pause, step, speed
- Blocked by #47

### Phase 6 — SortingPage (#50)
- `SortingToolbar`: algorithm selector, size slider (10–200), Randomize button
- `SortingCanvas`: bar chart with highlight colors for compared/swapped indices
- `SortingPage`: wires toolbar, canvas, shared ControlBar, stats, Home button
- Home page entry in visualizer registry (`#/sorting`)
- Blocked by #48, #49

## Visualization

- Bar chart: horizontal array of vertical bars, height = value
- Colors: default bar, compared indices, swapped indices
- Optional alternate views (numbered cells, dot plot) as stretch goal

## Array generation

- Auto-random array on page load
- Size slider (10–200)
- "Randomize" button to regenerate

## Home page

New card under pathfinding: "Sorting" with description "Watch Bubble, Quick, Merge, and more sort an array step by step."
