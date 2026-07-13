import { GridModel, CellPosition, CellType } from '../types';

const DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function neighbors(grid: GridModel, pos: CellPosition): CellPosition[] {
  const result: CellPosition[] = [];
  for (const [dr, dc] of DIRS) {
    const nr = pos.row + dr;
    const nc = pos.col + dc;
    if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols) {
      result.push({ row: nr, col: nc });
    }
  }
  return result;
}

export function ensureSolvable(grid: GridModel): GridModel {
  const { start, goal } = grid;
  if (!start || !goal) return grid;

  if (hasPath(grid)) return grid;

  const queue: CellPosition[] = [start];
  const cameFrom = new Map<string, CellPosition>();
  const visited = new Set<string>();
  const startKey = `${start.row},${start.col}`;
  visited.add(startKey);

  let found = false;
  while (queue.length > 0 && !found) {
    const current = queue.shift()!;
    for (const n of neighbors(grid, current)) {
      const nKey = `${n.row},${n.col}`;
      if (visited.has(nKey)) continue;
      visited.add(nKey);
      cameFrom.set(nKey, current);
      if (n.row === goal.row && n.col === goal.col) {
        found = true;
        break;
      }
      queue.push(n);
    }
  }

  if (!found) return grid;

  const cells = grid.cells.map((row) => [...row]);

  let key = `${goal.row},${goal.col}`;
  while (key !== startKey) {
    const pos = cameFrom.get(key);
    if (!pos) break;
    const current = cells[pos.row][pos.col] as CellType;
    if (current === 'wall') {
      cells[pos.row][pos.col] = 'default';
    }
    key = `${pos.row},${pos.col}`;
  }

  return { ...grid, cells };
}

function hasPath(grid: GridModel): boolean {
  if (!grid.start || !grid.goal) return false;

  const visited = new Set<string>();
  const queue = [grid.start];
  visited.add(`${grid.start.row},${grid.start.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.row === grid.goal.row && current.col === grid.goal.col) {
      return true;
    }

    for (const n of neighbors(grid, current)) {
      const type = grid.cells[n.row][n.col] as CellType;
      if (type === 'wall') continue;
      const key = `${n.row},${n.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(n);
      }
    }
  }

  return false;
}
