import { describe, it, expect } from 'vitest';
import { createGrid, setWall, setGravel, setCell } from '../grid/gridModel';
import { pathCost } from '../grid/gridUtils';
import { getAlgorithm } from './pathfinding';
import { astar } from './pathfinding/astar';
import { dijkstra } from './pathfinding/dijkstra';
import { bfs } from './pathfinding/bfs';
import { dfs } from './pathfinding/dfs';
import type { PathfindingAlgorithmFn, GridModel, PathfindingAlgorithmStep } from '../types';

function makeGrid(rows: number, cols: number): GridModel {
  return createGrid(rows, cols);
}

function wallOffGoal(grid: GridModel): GridModel {
  if (!grid.goal) return grid;
  const { row, col } = grid.goal;
  const neighbors = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ];
  let g = grid;
  for (const n of neighbors) {
    if (n.row >= 0 && n.row < grid.rows && n.col >= 0 && n.col < grid.cols) {
      if (g.cells[n.row][n.col] === 'default') {
        g = setWall(g, n);
      }
    }
  }
  return g;
}

function runAlgorithm(fn: PathfindingAlgorithmFn, grid: GridModel): PathfindingAlgorithmStep[] {
  const steps: PathfindingAlgorithmStep[] = [];
  const gen = fn(grid);
  for (const step of gen) {
    steps.push(step);
  }
  return steps;
}

function pathIsContinuous(path: NonNullable<PathfindingAlgorithmStep['path']>): boolean {
  for (let i = 1; i < path.length; i++) {
    const dr = Math.abs(path[i].row - path[i - 1].row);
    const dc = Math.abs(path[i].col - path[i - 1].col);
    if (dr + dc !== 1) return false;
  }
  return true;
}

function testAlgorithm(name: string, fn: PathfindingAlgorithmFn, shouldFindShortest: boolean) {
  describe(name, () => {
    it('finds a path on an empty grid', () => {
      const grid = makeGrid(5, 5);
      const steps = runAlgorithm(fn, grid);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(last.path).not.toBeNull();
      expect(last.path!.length).toBeGreaterThan(0);
    });

    it('reports failure when goal is unreachable', () => {
      let grid = makeGrid(5, 5);
      grid = wallOffGoal(grid);
      const steps = runAlgorithm(fn, grid);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(last.path).toBeNull();
    });

    it('produces a contiguous path', () => {
      const grid = makeGrid(5, 5);
      const steps = runAlgorithm(fn, grid);
      const last = steps[steps.length - 1];

      expect(last.path).not.toBeNull();
      expect(pathIsContinuous(last.path!)).toBe(true);
    });

    it('path starts at start and ends at goal', () => {
      const grid = makeGrid(5, 5);
      const steps = runAlgorithm(fn, grid);
      const last = steps[steps.length - 1];

      expect(last.path).not.toBeNull();
      const path = last.path!;
      expect(path[0]).toEqual(grid.start);
      expect(path[path.length - 1]).toEqual(grid.goal);
    });

    it('only the final step has done=true', () => {
      const grid = makeGrid(5, 5);
      const steps = runAlgorithm(fn, grid);

      for (let i = 0; i < steps.length - 1; i++) {
        expect(steps[i].done).toBe(false);
      }
      expect(steps[steps.length - 1].done).toBe(true);
    });

    it('yields at least one step', () => {
      const grid = makeGrid(5, 5);
      const steps = runAlgorithm(fn, grid);
      expect(steps.length).toBeGreaterThanOrEqual(1);
    });

    it('handles start == goal (adjacent)', () => {
      const grid = makeGrid(3, 3);
      grid.cells[1][1] = 'start';
      grid.cells[1][2] = 'goal';
      grid.start = { row: 1, col: 1 };
      grid.goal = { row: 1, col: 2 };

      const steps = runAlgorithm(fn, grid);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(last.path).not.toBeNull();
    });

    if (shouldFindShortest) {
      it('finds the shortest path on empty grid', () => {
        const grid = makeGrid(5, 5);
        const steps = runAlgorithm(fn, grid);
        const last = steps[steps.length - 1];
        const path = last.path!;

        const expected =
          Math.abs(grid.start!.row - grid.goal!.row) +
          Math.abs(grid.start!.col - grid.goal!.col) +
          1;
        expect(path.length).toBe(expected);
      });
    }
  });
}

describe('algorithms', () => {
  testAlgorithm('A*', astar, true);
  testAlgorithm('Dijkstra', dijkstra, true);
  testAlgorithm('BFS', bfs, true);
  testAlgorithm('DFS', dfs, false);
});

function makeGravelGrid(): GridModel {
  let grid = createGrid(5, 5);
  grid = setCell(grid, grid.start!, 'default');
  grid = setCell(grid, grid.goal!, 'default');
  grid = setCell(grid, { row: 2, col: 0 }, 'start');
  grid = setCell(grid, { row: 2, col: 4 }, 'goal');
  grid = setGravel(grid, { row: 2, col: 1 });
  grid = setGravel(grid, { row: 2, col: 2 });
  grid = setGravel(grid, { row: 2, col: 3 });
  return { ...grid, start: { row: 2, col: 0 }, goal: { row: 2, col: 4 } };
}

describe('weighted pathfinding with gravel', () => {
  it('A* avoids gravel when detour is cheaper', () => {
    const grid = makeGravelGrid();
    const steps = runAlgorithm(astar, grid);
    const last = steps[steps.length - 1];
    expect(last.path).not.toBeNull();
    const cost = pathCost(last.path!, grid);
    const directCost = 2 + 2 + 2 + 1;
    expect(cost).toBeLessThan(directCost);
  });

  it('Dijkstra avoids gravel when detour is cheaper', () => {
    const grid = makeGravelGrid();
    const steps = runAlgorithm(dijkstra, grid);
    const last = steps[steps.length - 1];
    expect(last.path).not.toBeNull();
    const cost = pathCost(last.path!, grid);
    const directCost = 2 + 2 + 2 + 1;
    expect(cost).toBeLessThan(directCost);
  });

  it('BFS ignores gravel costs and may take suboptimal path by cost', () => {
    const grid = makeGravelGrid();
    const steps = runAlgorithm(bfs, grid);
    const last = steps[steps.length - 1];
    expect(last.path).not.toBeNull();
    const cost = pathCost(last.path!, grid);
    const directCost = 2 + 2 + 2 + 1;
    expect(cost).toBeGreaterThanOrEqual(directCost);
  });
});

describe('algorithm registry guaranteesShortest', () => {
  it('A* always guarantees shortest', () => {
    const astarInfo = getAlgorithm('A*')!;
    const grid = createGrid(5, 5);
    expect(astarInfo.guaranteesShortest(grid)).toBe(true);
  });

  it('Dijkstra always guarantees shortest', () => {
    const dijkstraInfo = getAlgorithm('Dijkstra')!;
    const grid = createGrid(5, 5);
    expect(dijkstraInfo.guaranteesShortest(grid)).toBe(true);
  });

  it('BFS guarantees shortest on grid without gravel', () => {
    const bfsInfo = getAlgorithm('BFS')!;
    const grid = createGrid(5, 5);
    expect(bfsInfo.guaranteesShortest(grid)).toBe(true);
  });

  it('BFS does not guarantee shortest on grid with gravel', () => {
    const bfsInfo = getAlgorithm('BFS')!;
    const grid = makeGravelGrid();
    expect(bfsInfo.guaranteesShortest(grid)).toBe(false);
  });

  it('DFS never guarantees shortest', () => {
    const dfsInfo = getAlgorithm('DFS')!;
    const grid = createGrid(5, 5);
    expect(dfsInfo.guaranteesShortest(grid)).toBe(false);
  });
});
