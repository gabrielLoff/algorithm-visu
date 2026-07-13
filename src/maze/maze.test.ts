import { describe, it, expect } from 'vitest';
import { createGrid } from '../grid/gridModel';
import { getNeighbors } from '../grid/gridUtils';
import { recursiveDivision } from './recursiveDivision';
import { prim } from './prim';

function cellType(grid: ReturnType<typeof createGrid>, r: number, c: number) {
  return grid.cells[r][c];
}

function gridHasPath(grid: ReturnType<typeof createGrid>): boolean {
  if (!grid.start || !grid.goal) return false;

  const visited = new Set<string>();
  const queue = [grid.start];
  visited.add(`${grid.start.row},${grid.start.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.row === grid.goal.row && current.col === grid.goal.col) return true;

    for (const n of getNeighbors(grid, current)) {
      const key = `${n.row},${n.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(n);
      }
    }
  }

  return false;
}

describe('recursiveDivision', () => {
  it('produces a solvable maze from an empty grid', () => {
    const grid = createGrid(11, 11);
    const maze = recursiveDivision(grid);
    expect(gridHasPath(maze)).toBe(true);
  });

  it('does not turn start or goal into walls', () => {
    const grid = createGrid(11, 11);
    const maze = recursiveDivision(grid);
    expect(cellType(maze, grid.start!.row, grid.start!.col)).toBe('start');
    expect(cellType(maze, grid.goal!.row, grid.goal!.col)).toBe('goal');
  });

  it('adds walls (not a no-op)', () => {
    const grid = createGrid(11, 11);
    const maze = recursiveDivision(grid);
    let wallCount = 0;
    for (const row of maze.cells) {
      for (const cell of row) {
        if (cell === 'wall') wallCount++;
      }
    }
    expect(wallCount).toBeGreaterThan(0);
  });
});

describe('prim', () => {
  it('produces a solvable maze from an empty grid', () => {
    const grid = createGrid(11, 11);
    const maze = prim(grid);
    expect(gridHasPath(maze)).toBe(true);
  });

  it('does not turn start or goal into walls', () => {
    const grid = createGrid(11, 11);
    const maze = prim(grid);
    expect(cellType(maze, grid.start!.row, grid.start!.col)).toBe('start');
    expect(cellType(maze, grid.goal!.row, grid.goal!.col)).toBe('goal');
  });

  it('adds walls (not a no-op)', () => {
    const grid = createGrid(11, 11);
    const maze = prim(grid);
    let wallCount = 0;
    for (const row of maze.cells) {
      for (const cell of row) {
        if (cell === 'wall') wallCount++;
      }
    }
    expect(wallCount).toBeGreaterThan(0);
  });
});
