# Algorithm Visualizer — Implementation Plan

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Build tool | Vite | Fast HMR, zero-config TS, optimized builds |
| Framework | React 18+ | Component model, hooks for state/animation |
| Language | TypeScript | Type safety across algorithm interfaces |
| Rendering | HTML5 Canvas | Smooth 60fps grid rendering, pixel-level control |
| Styling | CSS Modules | Scoped styles, no extra dependency |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  App                                                │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Toolbar  │  │  GridCanvas  │  │  ControlBar   │ │
│  │          │  │              │  │               │ │
│  │ Algo ▼  │  │ ┌──────────┐ │  │ ▶ ⏸ ⏭  ─●─  │ │
│  │ 🧱🏁🎯🔄│  │ │ Canvas   │ │  │ speed: 50    │ │
│  │ Clear    │  │ │ (WebGL?  │ │  │               │ │
│  │ Maze     │  │ │  No, 2D) │ │  └───────────────┘ │
│  └──────────┘  │ └──────────┘ │  ┌───────────────┐ │
│                └──────────────┘  │  InfoPanel    │ │
│                                  │  Stats+Legend │ │
│                                  └───────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User Click (canvas)
    │
    ▼
useGrid hook (grid state + current mode)
    │
    ▼
Grid model (2D CellType[][])
    │
    ▼
Algorithm generator ←── picks algorithm from registry
    │
    ▼
Generator yields AlgorithmStep[]
    │
    ▼
useAnimation hook manages step playback
    │
    ▼
Canvas renderer draws current frame
```

---

## Project Structure

```
algorithm-visu/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.module.css
│   │
│   ├── types/
│   │   └── index.ts                 # All shared types
│   │
│   ├── grid/
│   │   ├── gridModel.ts             # Grid creation, cell mutation
│   │   └── gridUtils.ts             # getNeighbors, heuristic, etc.
│   │
│   ├── algorithms/
│   │   ├── index.ts                 # Registry + AlgorithmInfo map
│   │   ├── astar.ts                 # A* generator
│   │   ├── dijkstra.ts              # Dijkstra generator
│   │   ├── bfs.ts                   # BFS generator
│   │   └── dfs.ts                   # DFS generator
│   │
│   ├── renderer/
│   │   └── canvasRenderer.ts        # Draws grid state to canvas
│   │
│   ├── hooks/
│   │   ├── useGrid.ts               # Grid editing state + actions
│   │   └── useAnimation.ts          # Playback controller
│   │
│   └── components/
│       ├── Toolbar.tsx
│       ├── Toolbar.module.css
│       ├── GridCanvas.tsx
│       ├── GridCanvas.module.css
│       ├── ControlBar.tsx
│       ├── ControlBar.module.css
│       ├── InfoPanel.tsx
│       └── InfoPanel.module.css
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Type System

```typescript
// types/index.ts

type CellType = 'empty' | 'wall' | 'start' | 'goal';

interface CellPosition {
  row: number;
  col: number;
}

interface GridModel {
  rows: number;
  cols: number;
  cells: CellType[][];
  start: CellPosition | null;
  goal: CellPosition | null;
}

type AlgorithmStep = {
  frontier: CellPosition[];       // Open set — nodes to explore (yellow)
  visited: CellPosition[];        // Closed set — already explored (blue/cyan)
  current: CellPosition | null;   // Node being expanded right now (purple)
  path: CellPosition[] | null;    // Final reconstructed path (green), null until done
  done: boolean;                  // Algorithm finished
};

type AlgorithmGenerator = Generator<AlgorithmStep, void, undefined>;

type AlgorithmFn = (grid: GridModel) => AlgorithmGenerator;

interface AlgorithmInfo {
  name: string;
  fn: AlgorithmFn;
  description: string;
  weighted: boolean;              // true = A*/Dijkstra, false = BFS/DFS
  guaranteesShortest: boolean;    // BFS/Dijkstra/A* = true, DFS = false
}
```

---

## Algorithm Interface (generator-based)

Every pathfinding algorithm is a **generator function**:

```typescript
function* astar(grid: GridModel): AlgorithmGenerator {
  // Setup: priority queue, gScores, cameFrom, etc.
  
  // Yield initial state (just start in frontier)
  yield { frontier: [start], visited: [], current: null, path: null, done: false };
  
  while (frontier.length > 0) {
    const current = frontier.pop();  // get lowest f-score
    
    yield { frontier, visited, current, path: null, done: false };
    
    if (current.row === goal.row && current.col === goal.col) {
      const path = reconstructPath(cameFrom, current);
      yield { frontier: [], visited, current: null, path, done: true };
      return;
    }
    
    visited.push(current);
    
    for (const neighbor of getNeighbors(current, grid)) {
      // ... standard A* logic
      // Only yield when we want to show a frame
    }
    
    yield { frontier, visited, current, path: null, done: false };
  }
  
  // No path found
  yield { frontier: [], visited, current: null, path: null, done: true };
}
```

This matches the Python generator pattern from sorting-visualizer — the algorithm yields frames, the animation system consumes them.

---

## Grid Model

The `gridModel.ts` module provides pure functions:

| Function | Purpose |
|---|---|
| `createGrid(rows, cols)` | Returns a fresh `GridModel` with all `'empty'` |
| `setCell(grid, pos, type)` | Returns new grid with cell type changed |
| `toggleWall(grid, pos)` | Toggles `'wall'` ↔ `'empty'` at position |
| `setStart(grid, pos)` | Moves start to new position |
| `setGoal(grid, pos)` | Moves goal to new position |
| `clearPath(grid)` | Removes visited/path visual state (not in model) |
| `resetGrid(grid)` | Clears walls, keeps start and goal |

`gridUtils.ts` provides helpers used by algorithms:

| Function | Purpose |
|---|---|
| `getNeighbors(grid, pos)` | Returns walkable adjacent cells (4-directional) |
| `manhattan(a, b)` | Manhattan distance heuristic |
| `euclidean(a, b)` | Euclidean distance heuristic |

---

## Rendering Pipeline

`canvasRenderer.ts` draws a single frame:

1. **Clear** canvas
2. **Draw grid background** — light gray for empty cells
3. **Draw walls** — dark gray/black rectangles
4. **Draw visited** — cyan/blue tint
5. **Draw frontier** — yellow/orange tint  
6. **Draw current** — purple highlight (pulsing?)
7. **Draw path** — green line connecting start→goal nodes
8. **Draw start/goal** — green/red circles or icons
9. **Draw grid lines** — thin light borders

Color mapping:

| State | Color |
|---|---|
| Empty | White |
| Wall | #374151 (dark gray) |
| Start | #22c55e (green) |
| Goal | #ef4444 (red) |
| Visited | #67e8f9 at 40% opacity |
| Frontier | #fde047 at 60% opacity |
| Current | #a855f7 (purple) |
| Path | #facc15 (gold) |

---

## Component Design

### Toolbar
- **Algorithm selector** — dropdown of registered algorithms
- **Mode buttons** — Wall / Start / Goal (single-select toggle group)
- **Clear button** — resets walls only
- **Generate Maze** — recursive division (stretch goal, can be v2)
- **Reset** — full reset

### GridCanvas
- Renders the `<canvas>` element
- Handles mouse events: `mousedown`, `mousemove`, `mouseup`
- Translates pixel coordinates → grid cell
- On click: applies current mode (wall/start/goal) to that cell
- Supports click-and-drag for drawing walls
- Resizes canvas on window resize

### ControlBar
- **Play/Pause** toggle button
- **Step Forward** button (advances one algorithm step)
- **Step Backward** (stretch goal — requires storing history)
- **Speed slider** — range 1–100, controls interval between steps

### InfoPanel
- **Stats**: Nodes visited, path length, algorithm name
- **Legend**: color swatches explaining what each color means
- **Status**: "Ready" / "Searching..." / "Path found! (length: N)" / "No path exists"

---

## Hooks

### useGrid
```typescript
function useGrid(rows: number, cols: number) {
  return {
    grid: GridModel,
    mode: 'wall' | 'start' | 'goal',
    setMode: (m) => void,
    handleCellClick: (pos) => void,
    handleCellDrag: (pos) => void,
    clearWalls: () => void,
    reset: () => void,
  };
}
```

### useAnimation
```typescript
function useAnimation(grid: GridModel, algorithmFn: AlgorithmFn | null) {
  return {
    steps: AlgorithmStep[],           // All steps (for step-back support)
    currentStepIndex: number,
    isPlaying: boolean,
    isDone: boolean,
    speed: number,
    play: () => void,
    pause: () => void,
    stepForward: () => void,
    stepBackward: () => void,
    setSpeed: (s: number) => void,
    run: () => void,                  // Start the algorithm
    currentStep: AlgorithmStep | null,
  };
}
```

Runtime approach:
1. User clicks "Play" → `run()` calls the generator eagerly, storing all steps in an array
2. `play()` starts a `setInterval` at `speed` ms, incrementing `currentStepIndex`
3. Canvas re-renders when `currentStepIndex` changes
4. This enables instant "step back" by decrementing the index

---

## Implementation Steps

### Phase 1: Scaffold (steps 1–3)
1. **Initialize Vite + React + TS project** in `algorithm-visu/`
2. **Define types** (`types/index.ts`) — all interfaces and type aliases
3. **Implement Grid model** (`grid/gridModel.ts`, `grid/gridUtils.ts`) with tests

### Phase 2: Core rendering (steps 4–5)
4. **Canvas renderer** (`renderer/canvasRenderer.ts`) — draw grid from model + step state
5. **GridCanvas component** — canvas element with mouse interaction, calls `useGrid`

### Phase 3: Algorithms (steps 6–9)
6. **A* algorithm** (`algorithms/astar.ts`) — first and primary algorithm
7. **Dijkstra algorithm** (`algorithms/dijkstra.ts`)
8. **BFS algorithm** (`algorithms/bfs.ts`)
9. **DFS algorithm** (`algorithms/dfs.ts`)
10. **Algorithm registry** (`algorithms/index.ts`)

### Phase 4: Animation (steps 10–12)
11. **useAnimation hook** — playback controller
12. **ControlBar component** — play/pause/step/speed UI

### Phase 5: Polish (steps 13–16)
13. **Toolbar component** — algorithm selector, mode buttons, clear/reset
14. **InfoPanel component** — stats and legend
15. **App component** — wire everything together
16. **CSS styling** — layout, responsive design

### Phase 6: Extras (if time)
- Random maze generation (recursive division)
- Diagonal movement option
- Weighted nodes (for Dijkstra/A* with terrain costs)
- Step-back support in animation
- History recording / comparison view

---

## Open Questions

1. **Grid size** — Default 20x40? Configurable? Auto-fit to window?
2. **Canvas scaling** — Fixed cell size (e.g. 25px) or dynamic to fill available space?
3. **Heuristic for A*** — Manhattan only, or option to switch to Euclidean?
4. **Mobile support** — Touch events for grid interaction?
5. **Tests** — Vitest? What level of coverage do we want?
