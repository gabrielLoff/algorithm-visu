import { describe, it, expect } from 'vitest';
import {
  createGrid,
  setCell,
  setWall,
  setGravel,
  setDefault,
  setStart,
  setGoal,
  clearAll,
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

  it('fills remaining cells as default', () => {
    const grid = createGrid(3, 3);
    let defaultCount = 0;
    for (const row of grid.cells) {
      for (const cell of row) {
        if (cell === 'default') defaultCount++;
      }
    }
    expect(defaultCount).toBe(7);
  });
});

describe('setCell', () => {
  it('sets a cell type and returns a new grid', () => {
    const grid = createGrid(3, 3);
    const next = setCell(grid, { row: 1, col: 1 }, 'wall');
    expect(next.cells[1][1]).toBe('wall');
    expect(grid.cells[1][1]).toBe('default');
  });
});

describe('setWall', () => {
  it('places wall on default cell', () => {
    const grid = createGrid(3, 3);
    const next = setWall(grid, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('wall');
  });

  it('places wall over gravel cell', () => {
    const grid = createGrid(3, 3);
    const withGravel = setGravel(grid, { row: 1, col: 1 });
    const next = setWall(withGravel, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('wall');
  });

  it('is no-op on wall cell (one-way)', () => {
    const grid = createGrid(3, 3);
    const withWall = setWall(grid, { row: 1, col: 1 });
    const next = setWall(withWall, { row: 1, col: 1 });
    expect(next).toBe(withWall);
  });

  it('refuses on start cell', () => {
    const grid = createGrid(5, 5);
    const startPos = grid.start!;
    const next = setWall(grid, startPos);
    expect(next).toBe(grid);
  });

  it('refuses on goal cell', () => {
    const grid = createGrid(5, 5);
    const goalPos = grid.goal!;
    const next = setWall(grid, goalPos);
    expect(next).toBe(grid);
  });

  it('does not mutate the original grid', () => {
    const grid = createGrid(3, 3);
    setWall(grid, { row: 1, col: 1 });
    expect(grid.cells[1][1]).toBe('default');
  });
});

describe('setGravel', () => {
  it('places gravel on default cell', () => {
    const grid = createGrid(3, 3);
    const next = setGravel(grid, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('gravel');
  });

  it('places gravel over wall cell', () => {
    const grid = createGrid(3, 3);
    const withWall = setWall(grid, { row: 1, col: 1 });
    const next = setGravel(withWall, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('gravel');
  });

  it('is no-op on gravel cell', () => {
    const grid = createGrid(3, 3);
    const withGravel = setGravel(grid, { row: 1, col: 1 });
    const next = setGravel(withGravel, { row: 1, col: 1 });
    expect(next).toBe(withGravel);
  });

  it('refuses on start cell', () => {
    const grid = createGrid(5, 5);
    const startPos = grid.start!;
    const next = setGravel(grid, startPos);
    expect(next).toBe(grid);
  });

  it('refuses on goal cell', () => {
    const grid = createGrid(5, 5);
    const goalPos = grid.goal!;
    const next = setGravel(grid, goalPos);
    expect(next).toBe(grid);
  });
});

describe('setDefault', () => {
  it('clears wall to default', () => {
    const grid = createGrid(3, 3);
    const withWall = setWall(grid, { row: 1, col: 1 });
    const next = setDefault(withWall, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('default');
  });

  it('clears gravel to default', () => {
    const grid = createGrid(3, 3);
    const withGravel = setGravel(grid, { row: 1, col: 1 });
    const next = setDefault(withGravel, { row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('default');
  });

  it('is no-op on default cell', () => {
    const grid = createGrid(3, 3);
    const next = setDefault(grid, { row: 1, col: 1 });
    expect(next).toBe(grid);
  });

  it('refuses on start cell', () => {
    const grid = createGrid(5, 5);
    const startPos = grid.start!;
    const next = setDefault(grid, startPos);
    expect(next).toBe(grid);
  });

  it('refuses on goal cell', () => {
    const grid = createGrid(5, 5);
    const goalPos = grid.goal!;
    const next = setDefault(grid, goalPos);
    expect(next).toBe(grid);
  });
});

describe('setStart', () => {
  it('moves start to a default cell', () => {
    const grid = createGrid(5, 5);
    const oldStart = grid.start!;
    const next = setStart(grid, { row: 1, col: 1 });
    expect(next.start).toEqual({ row: 1, col: 1 });
    expect(next.cells[1][1]).toBe('start');
    expect(next.cells[oldStart.row][oldStart.col]).toBe('default');
  });

  it('refuses to move start onto a wall', () => {
    let grid = createGrid(5, 5);
    grid = setWall(grid, { row: 1, col: 1 });
    const next = setStart(grid, { row: 1, col: 1 });
    expect(next).toBe(grid);
  });

  it('refuses to move start onto gravel', () => {
    let grid = createGrid(5, 5);
    grid = setGravel(grid, { row: 1, col: 1 });
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
  it('moves goal to a default cell', () => {
    const grid = createGrid(5, 5);
    const oldGoal = grid.goal!;
    const next = setGoal(grid, { row: 3, col: 3 });
    expect(next.goal).toEqual({ row: 3, col: 3 });
    expect(next.cells[3][3]).toBe('goal');
    expect(next.cells[oldGoal.row][oldGoal.col]).toBe('default');
  });

  it('refuses to move goal onto a wall', () => {
    let grid = createGrid(5, 5);
    grid = setWall(grid, { row: 3, col: 3 });
    const next = setGoal(grid, { row: 3, col: 3 });
    expect(next).toBe(grid);
  });

  it('refuses to move goal onto gravel', () => {
    let grid = createGrid(5, 5);
    grid = setGravel(grid, { row: 3, col: 3 });
    const next = setGoal(grid, { row: 3, col: 3 });
    expect(next).toBe(grid);
  });

  it('returns same grid when clicking existing goal', () => {
    const grid = createGrid(5, 5);
    const next = setGoal(grid, grid.goal!);
    expect(next).toBe(grid);
  });
});

describe('clearAll', () => {
  it('removes all walls and gravel, keeps start and goal', () => {
    let grid = createGrid(5, 5);
    grid = setWall(grid, { row: 0, col: 0 });
    grid = setWall(grid, { row: 1, col: 1 });
    grid = setGravel(grid, { row: 2, col: 2 });

    const cleared = clearAll(grid);

    for (const row of cleared.cells) {
      for (const cell of row as CellType[]) {
        expect(cell).not.toBe('wall');
        expect(cell).not.toBe('gravel');
      }
    }

    expect(cleared.cells[grid.start!.row][grid.start!.col]).toBe('start');
    expect(cleared.cells[grid.goal!.row][grid.goal!.col]).toBe('goal');
  });
});

describe('resetGrid', () => {
  it('returns a fresh grid with original dimensions', () => {
    let grid = createGrid(5, 5);
    grid = setWall(grid, { row: 0, col: 0 });

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
