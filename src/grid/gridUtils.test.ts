import { describe, it, expect } from 'vitest';
import {
  getNeighbors,
  getCost,
  manhattan,
  euclidean,
  cellKey,
  parseCellKey,
  pathExists,
} from './gridUtils';
import { createGrid, setWall } from './gridModel';

function smallGrid() {
  return createGrid(5, 5);
}

describe('getCost', () => {
  it('returns 1 for default cells', () => {
    expect(getCost('default')).toBe(1);
  });

  it('returns 1 for start cells', () => {
    expect(getCost('start')).toBe(1);
  });

  it('returns 1 for goal cells', () => {
    expect(getCost('goal')).toBe(1);
  });

  it('returns 2 for gravel cells', () => {
    expect(getCost('gravel')).toBe(2);
  });

  it('returns 1 for wall cells (for completeness, though impassable)', () => {
    expect(getCost('wall')).toBe(1);
  });
});

describe('getNeighbors', () => {
  it('returns up to 4 walkable neighbors for a central cell', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 2, col: 2 });
    expect(neighbors).toHaveLength(4);
    const coords = neighbors.map((n) => `${n.pos.row},${n.pos.col}`).sort();
    expect(coords).toEqual(['1,2', '2,1', '2,3', '3,2']);
  });

  it('returns fewer neighbors for corner cells', () => {
    const grid = smallGrid();
    const topLeft = getNeighbors(grid, { row: 0, col: 0 });
    expect(topLeft).toHaveLength(2);
    const bottomRight = getNeighbors(grid, { row: 4, col: 4 });
    expect(bottomRight).toHaveLength(2);
  });

  it('excludes wall cells', () => {
    const grid = createGrid(3, 3);
    grid.cells[1][1] = 'wall';
    const neighbors = getNeighbors(grid, { row: 0, col: 1 });
    const coords = neighbors.map((n) => `${n.pos.row},${n.pos.col}`).sort();
    expect(coords).toEqual(['0,0', '0,2']);
  });

  it('includes start and goal cells as walkable', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 2, col: 2 });
    const types = neighbors.map((n) => grid.cells[n.pos.row][n.pos.col]);
    expect(types).toContain('start');
    expect(types).toContain('goal');
  });

  it('includes gravel cells as walkable', () => {
    const grid = createGrid(3, 3);
    grid.cells[0][1] = 'gravel';
    const neighbors = getNeighbors(grid, { row: 0, col: 0 });
    const hasGravel = neighbors.some((n) => grid.cells[n.pos.row][n.pos.col] === 'gravel');
    expect(hasGravel).toBe(true);
  });

  it('returns cost of 1 for default cells neighboring', () => {
    const grid = createGrid(3, 3);
    const neighbors = getNeighbors(grid, { row: 1, col: 1 });
    for (const n of neighbors) {
      if (grid.cells[n.pos.row][n.pos.col] === 'default') {
        expect(n.cost).toBe(1);
      }
    }
  });

  it('returns cost of 2 for gravel neighbors', () => {
    const grid = createGrid(3, 3);
    grid.cells[0][1] = 'gravel';
    const neighbors = getNeighbors(grid, { row: 0, col: 0 });
    const gravelNeighbor = neighbors.find((n) => grid.cells[n.pos.row][n.pos.col] === 'gravel');
    expect(gravelNeighbor).toBeDefined();
    expect(gravelNeighbor!.cost).toBe(2);
  });
});

describe('manhattan', () => {
  it('returns 0 for same position', () => {
    expect(manhattan({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(0);
  });

  it('returns sum of absolute differences', () => {
    expect(manhattan({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(7);
    expect(manhattan({ row: 5, col: 2 }, { row: 2, col: 6 })).toBe(7);
  });
});

describe('euclidean', () => {
  it('returns 0 for same position', () => {
    expect(euclidean({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(0);
  });

  it('returns straight-line distance', () => {
    expect(euclidean({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(5);
  });
});

describe('getNeighbors with step', () => {
  it('defaults to step=1 (backward compatible)', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 2, col: 2 });
    expect(neighbors).toHaveLength(4);
    const coords = neighbors.map((n) => `${n.pos.row},${n.pos.col}`).sort();
    expect(coords).toEqual(['1,2', '2,1', '2,3', '3,2']);
  });

  it('returns cells at distance 2 with step=2', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 2, col: 2 }, 2);
    expect(neighbors.length).toBeGreaterThanOrEqual(1);
    const coords = neighbors.map((n) => `${n.pos.row},${n.pos.col}`).sort();
    expect(coords).toEqual(['0,2', '2,0', '2,4', '4,2']);
  });

  it('excludes out-of-bounds cells with step=2', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 0, col: 0 }, 2);
    expect(neighbors).toHaveLength(2);
    const coords = neighbors.map((n) => `${n.pos.row},${n.pos.col}`).sort();
    expect(coords).toEqual(['0,2', '2,0']);
  });

  it('excludes walls even with step > 1', () => {
    const grid = createGrid(5, 5);
    grid.cells[2][0] = 'wall';
    const neighbors = getNeighbors(grid, { row: 2, col: 2 }, 2);
    const coords = neighbors.map((n) => `${n.pos.row},${n.pos.col}`).sort();
    expect(coords).toEqual(['0,2', '2,4', '4,2']);
  });
});

describe('cellKey', () => {
  it('formats a position as "row,col"', () => {
    expect(cellKey({ row: 3, col: 7 })).toBe('3,7');
  });
});

describe('parseCellKey', () => {
  it('parses "row,col" back into a CellPosition', () => {
    const pos = parseCellKey('5,10');
    expect(pos).toEqual({ row: 5, col: 10 });
  });

  it('is the inverse of cellKey', () => {
    const original = { row: 12, col: 34 };
    expect(parseCellKey(cellKey(original))).toEqual(original);
  });
});

describe('pathExists', () => {
  it('returns true for an empty grid (no walls)', () => {
    const grid = createGrid(5, 5);
    expect(pathExists(grid)).toBe(true);
  });

  it('returns true when start and goal are the same cell', () => {
    const grid = createGrid(3, 3);
    grid.start = { row: 1, col: 1 };
    grid.goal = { row: 1, col: 1 };
    grid.cells[1][1] = 'start';
    expect(pathExists(grid)).toBe(true);
  });

  it('returns false when start is blocked by walls', () => {
    let grid = createGrid(3, 3);
    grid = setWall(grid, { row: 0, col: 0 });
    grid = setWall(grid, { row: 2, col: 0 });
    grid = setWall(grid, { row: 1, col: 1 });
    grid = setWall(grid, { row: 0, col: 1 });
    grid = setWall(grid, { row: 2, col: 1 });
    expect(pathExists(grid)).toBe(false);
  });

  it('returns false when goal is blocked by walls', () => {
    let grid = createGrid(3, 3);
    grid = setWall(grid, { row: 0, col: 2 });
    grid = setWall(grid, { row: 2, col: 2 });
    grid = setWall(grid, { row: 1, col: 1 });
    grid = setWall(grid, { row: 0, col: 1 });
    grid = setWall(grid, { row: 2, col: 1 });
    expect(pathExists(grid)).toBe(false);
  });

  it('returns false when start is null', () => {
    const grid = createGrid(3, 3);
    grid.start = null;
    expect(pathExists(grid)).toBe(false);
  });

  it('returns false when goal is null', () => {
    const grid = createGrid(3, 3);
    grid.goal = null;
    expect(pathExists(grid)).toBe(false);
  });

  it('navigates around walls through open paths', () => {
    let grid = createGrid(5, 5);
    grid = setWall(grid, { row: 1, col: 2 });
    grid = setWall(grid, { row: 2, col: 2 });
    grid = setWall(grid, { row: 3, col: 2 });
    expect(pathExists(grid)).toBe(true);
  });

  it('finds path through gravel cells', () => {
    const grid = createGrid(3, 3);
    grid.cells[1][1] = 'gravel';
    expect(pathExists(grid)).toBe(true);
  });
});
