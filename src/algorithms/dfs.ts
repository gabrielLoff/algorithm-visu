import { AlgorithmGenerator, CellPosition, GridModel } from '../types';
import { getNeighbors } from '../grid/gridUtils';

function reconstructPath(cameFrom: Map<string, CellPosition>, current: CellPosition): CellPosition[] {
  const path: CellPosition[] = [current];
  let key = `${current.row},${current.col}`;
  while (cameFrom.has(key)) {
    const prev = cameFrom.get(key)!;
    path.unshift(prev);
    key = `${prev.row},${prev.col}`;
  }
  return path;
}

export function* dfs(grid: GridModel): AlgorithmGenerator {
  if (!grid.start || !grid.goal) return;

  const stack: CellPosition[] = [grid.start];
  const visited = new Set<string>();
  const cameFrom = new Map<string, CellPosition>();
  visited.add(`${grid.start.row},${grid.start.col}`);

  yield { frontier: [grid.start], visited: [], current: null, path: null, done: false };

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current.row === grid.goal.row && current.col === grid.goal.col) {
      const path = reconstructPath(cameFrom, current);
      yield { frontier: [], visited: [], current: null, path, done: true };
      return;
    }

    const neighbors = getNeighbors(grid, current);
    for (const n of neighbors) {
      const nKey = `${n.row},${n.col}`;
      if (!visited.has(nKey)) {
        visited.add(nKey);
        cameFrom.set(nKey, current);
        stack.push(n);
      }
    }

    const visitedList: CellPosition[] = [];
    for (const key of visited) {
      const [r, c] = key.split(',').map(Number);
      if (!stack.some((s) => s.row === r && s.col === c)) {
        visitedList.push({ row: r, col: c });
      }
    }

    yield { frontier: [...stack], visited: visitedList, current, path: null, done: false };
  }

  yield { frontier: [], visited: [], current: null, path: null, done: true };
}
