import { describe, it, expect } from 'vitest';
import {
  createGrid,
  setCell,
  toggleWall,
  setStart,
  setGoal,
  clearWalls,
  resetGrid,
} from './gridModel';
import type { CellType } from '../types';

describe('createGrid', () => {
  it('creates a grid with correct dimensions', () => {
    const grid = createGrid(5, 8);
    expect(grid.rows).toBe(5);
    expect(grid.cols).toBe(8);
    expect(grid.cells).toHaveLength(5);
    expect(grid.cells[0]).toHaveLength(8);
  });

  it('places start at (midRow, cols/4)', () => {
    const grid = createGrid(5, 8);
    expect(grid.start).toEqual({ row: 2, col: 2 });
    expect(grid.cells[2][2]).toBe('start');
  });

  it('places goal at (midRow, 3*cols/4)', () => {
    const grid = createGrid(5, 8);
    expect(grid.goal).toEqual({ row: 2, col: 6 });
    expect(grid.cells[2][6]).toBe('goal');
  });

  it('fills remaining cells as empty', () => {
    const grid = createGrid(3, 3);
    let emptyCount = 0;
    for (const row of grid.cells) {
      for (const cell of row) {
        if (cell === 'empty') emptyCount++;
      }
    }
    expect(emptyCount).toBe(7);
  });
});

describe('setCell', () => {
  it('sets a cell type and returns a new grid', () => {
    const grid = createGrid(3, 3);
    const next = setCell(grid, { row: 1, col: 1 }, 'wall');
    expect(next.cells[1][1]).toBe('wall');
    expect(grid.cells[1][1]).toBe('empty');
  });
});

describe('toggleWall', () => {
  it('toggles empty to wall', () => {
    const grid = createGrid(3, 3);
    const next = toggleWall(grid, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('wall');
  });

  it('toggles wall to empty', () => {
    const grid = createGrid(3, 3);
    const withWall = toggleWall(grid, { row: 1, col: 1 });
    const withoutWall = toggleWall(withWall, { row: 1, col: 1 });
    expect(withoutWall.cells[1][1]).toBe('empty');
  });

  it('does not toggle start cell', () => {
    const grid = createGrid(5, 5);
    const startPos = grid.start!;
    const next = toggleWall(grid, startPos);
    expect(next.cells[startPos.row][startPos.col]).toBe('start');
  });

  it('does not toggle goal cell', () => {
    const grid = createGrid(5, 5);
    const goalPos = grid.goal!;
    const next = toggleWall(grid, goalPos);
    expect(next.cells[goalPos.row][goalPos.col]).toBe('goal');
  });

  it('does not mutate the original grid', () => {
    const grid = createGrid(3, 3);
    toggleWall(grid, { row: 1, col: 1 });
    expect(grid.cells[1][1]).toBe('empty');
  });
});

describe('setStart', () => {
  it('moves start to an empty cell', () => {
    const grid = createGrid(5, 5);
    const oldStart = grid.start!;
    const next = setStart(grid, { row: 1, col: 1 });
    expect(next.start).toEqual({ row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('start');
    expect(next.cells[oldStart.row][oldStart.col]).toBe('empty');
  });

  it('refuses to move start onto a wall', () => {
    let grid = createGrid(5, 5);
    grid = toggleWall(grid, { row: 1, col: 1 });
    const next = setStart(grid, { row: 1, col: 1 });
    expect(next).toBe(grid);
  });

  it('returns same grid when clicking existing start', () => {
    const grid = createGrid(5, 5);
    const next = setStart(grid, grid.start!);
    expect(next).toBe(grid);
  });
});

describe('setGoal', () => {
  it('moves goal to an empty cell', () => {
    const grid = createGrid(5, 5);
    const oldGoal = grid.goal!;
    const next = setGoal(grid, { row: 3, col: 3 });
    expect(next.goal).toEqual({ row: 3, col: 3 });
    expect(next.cells[3][3]).toBe('goal');
    expect(next.cells[oldGoal.row][oldGoal.col]).toBe('empty');
  });

  it('refuses to move goal onto a wall', () => {
    let grid = createGrid(5, 5);
    grid = toggleWall(grid, { row: 3, col: 3 });
    const next = setGoal(grid, { row: 3, col: 3 });
    expect(next).toBe(grid);
  });

  it('returns same grid when clicking existing goal', () => {
    const grid = createGrid(5, 5);
    const next = setGoal(grid, grid.goal!);
    expect(next).toBe(grid);
  });
});

describe('clearWalls', () => {
  it('removes all walls, keeps start and goal', () => {
    let grid = createGrid(5, 5);
    grid = toggleWall(grid, { row: 0, col: 0 });
    grid = toggleWall(grid, { row: 1, col: 1 });
    grid = toggleWall(grid, { row: 2, col: 2 });

    const cleared = clearWalls(grid);

    for (const row of cleared.cells) {
      for (const cell of row as CellType[]) {
        expect(cell).not.toBe('wall');
      }
    }

    expect(cleared.cells[grid.start!.row][grid.start!.col]).toBe('start');
    expect(cleared.cells[grid.goal!.row][grid.goal!.col]).toBe('goal');
  });
});

describe('resetGrid', () => {
  it('returns a fresh grid with original dimensions', () => {
    let grid = createGrid(5, 5);
    grid = toggleWall(grid, { row: 0, col: 0 });

    const reset = resetGrid(grid);
    expect(reset.rows).toBe(5);
    expect(reset.cols).toBe(5);

    let wallCount = 0;
    for (const row of reset.cells) {
      for (const cell of row) {
        if (cell === 'wall') wallCount++;
      }
    }
    expect(wallCount).toBe(0);
  });
});
