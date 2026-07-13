import { GridModel, CellPosition, CellType } from '../types';
import { getNeighbors, DIRECTIONS } from '../grid/gridUtils';

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
    for (const dir of DIRECTIONS) {
      const nr = current.row + dir.row;
      const nc = current.col + dir.col;
      if (nr < 0 || nr >= grid.rows || nc < 0 || nc >= grid.cols) continue;
      const nKey = `${nr},${nc}`;
      if (visited.has(nKey)) continue;
      visited.add(nKey);
      cameFrom.set(nKey, current);
      if (nr === goal.row && nc === goal.col) {
        found = true;
        break;
      }
      queue.push({ row: nr, col: nc });
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

    for (const n of getNeighbors(grid, current)) {
      const key = `${n.pos.row},${n.pos.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(n.pos);
      }
    }
  }

  return false;
}
