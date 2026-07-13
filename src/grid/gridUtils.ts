import { CellPosition, GridModel } from '../types';

const DIRECTIONS: CellPosition[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

export function getNeighbors(grid: GridModel, pos: CellPosition): CellPosition[] {
  const neighbors: CellPosition[] = [];
  for (const dir of DIRECTIONS) {
    const nr = pos.row + dir.row;
    const nc = pos.col + dir.col;
    if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols) {
      if (grid.cells[nr][nc] !== 'wall') {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }
  return neighbors;
}

export function manhattan(a: CellPosition, b: CellPosition): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function euclidean(a: CellPosition, b: CellPosition): number {
  return Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2);
}
