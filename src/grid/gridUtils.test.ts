import { describe, it, expect } from 'vitest';
import { getNeighbors, manhattan, euclidean, cellKey, parseCellKey } from './gridUtils';
import { createGrid } from './gridModel';

function smallGrid() {
  return createGrid(5, 5);
}

describe('getNeighbors', () => {
  it('returns up to 4 walkable neighbors for a central cell', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 2, col: 2 });
    expect(neighbors).toHaveLength(4);
    const coords = neighbors.map((n) => `${n.row},${n.col}`).sort();
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
    const coords = neighbors.map((n) => `${n.row},${n.col}`).sort();
    expect(coords).toEqual(['0,0', '0,2']);
  });

  it('includes start and goal cells as walkable', () => {
    const grid = smallGrid();
    const neighbors = getNeighbors(grid, { row: 2, col: 2 });
    const types = neighbors.map((n) => grid.cells[n.row][n.col]);
    expect(types).toContain('start');
    expect(types).toContain('goal');
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
