import { AlgorithmGenerator, CellPosition, GridModel } from '../types';
import { getNeighbors, cellKey } from '../grid/gridUtils';
import { reconstructPath, computeDisplayLists } from './pathUtils';

export function* dfs(grid: GridModel): AlgorithmGenerator {
  if (!grid.start || !grid.goal) return;

  const stack: CellPosition[] = [grid.start];
  const explored = new Set<string>();
  const cameFrom = new Map<string, CellPosition>();
  explored.add(cellKey(grid.start));

  yield { frontier: [grid.start], visited: [], current: null, path: null, done: false };

  while (stack.length > 0) {
    const current = stack.pop()!;
    const currentKey = cellKey(current);

    if (current.row === grid.goal.row && current.col === grid.goal.col) {
      const path = reconstructPath(cameFrom, current);
      yield { frontier: [], visited: [], current: null, path, done: true };
      return;
    }

    const neighbors = getNeighbors(grid, current);
    for (const n of neighbors) {
      const nKey = cellKey(n.pos);
      if (!explored.has(nKey)) {
        explored.add(nKey);
        cameFrom.set(nKey, current);
        stack.push(n.pos);
      }
    }

    const frontierKeys = new Set(stack.map(cellKey));
    const { frontier, visited } = computeDisplayLists(explored, frontierKeys, currentKey);

    yield { frontier, visited, current, path: null, done: false };
  }

  yield { frontier: [], visited: [], current: null, path: null, done: true };
}
