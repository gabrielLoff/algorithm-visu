import { PathfindingAlgorithmGenerator, CellPosition, GridModel } from '../../types';
import { getNeighbors, cellKey } from '../../grid/gridUtils';
import { reconstructPath, computeDisplayLists } from './pathUtils';

export interface FrontierStrategy {
  add(item: CellPosition): void;
  remove(): CellPosition | undefined;
  readonly size: number;
  entries(): Iterable<CellPosition>;
}

export function* search(
  grid: GridModel,
  frontier: FrontierStrategy,
): PathfindingAlgorithmGenerator {
  if (!grid.start || !grid.goal) return;

  frontier.add(grid.start);
  const explored = new Set<string>();
  const cameFrom = new Map<string, CellPosition>();
  explored.add(cellKey(grid.start));

  yield { frontier: [grid.start], visited: [], current: null, path: null, done: false };

  while (frontier.size > 0) {
    const current = frontier.remove()!;
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
        frontier.add(n.pos);
      }
    }

    const frontierKeys = new Set([...frontier.entries()].map(cellKey));
    const { frontier: f, visited } = computeDisplayLists(explored, frontierKeys, currentKey);

    yield { frontier: f, visited, current, path: null, done: false };
  }

  yield { frontier: [], visited: [], current: null, path: null, done: true };
}
