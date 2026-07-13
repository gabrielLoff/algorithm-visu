import { CellPosition, CellType, GridModel } from '../types';

export function cellKey(pos: CellPosition): string {
  return `${pos.row},${pos.col}`;
}

export function parseCellKey(key: string): CellPosition {
  const [r, c] = key.split(',').map(Number);
  return { row: r, col: c };
}

export const DIRECTIONS: CellPosition[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

export function getCost(cellType: CellType): number {
  switch (cellType) {
    case 'gravel':
      return 2;
    default:
      return 1;
  }
}

export interface NeighborInfo {
  pos: CellPosition;
  cost: number;
}

export function getNeighbors(
  grid: GridModel,
  pos: CellPosition,
  step: number = 1,
): NeighborInfo[] {
  const neighbors: NeighborInfo[] = [];
  for (const dir of DIRECTIONS) {
    const nr = pos.row + dir.row * step;
    const nc = pos.col + dir.col * step;
    if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols) {
      const cellType = grid.cells[nr][nc];
      if (cellType !== 'wall') {
        neighbors.push({ pos: { row: nr, col: nc }, cost: getCost(cellType) });
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

export function hasGravel(grid: GridModel): boolean {
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell === 'gravel') return true;
    }
  }
  return false;
}

export function pathCost(path: CellPosition[], grid: GridModel): number {
  return path
    .slice(1)
    .reduce((sum, p) => sum + getCost(grid.cells[p.row][p.col]), 0);
}

export function pathExists(grid: GridModel): boolean {
  if (!grid.start || !grid.goal) return false;

  const visited = new Set<string>();
  const queue: CellPosition[] = [grid.start];
  visited.add(cellKey(grid.start));

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.row === grid.goal.row && current.col === grid.goal.col) {
      return true;
    }

    for (const n of getNeighbors(grid, current)) {
      const key = cellKey(n.pos);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(n.pos);
      }
    }
  }

  return false;
}
