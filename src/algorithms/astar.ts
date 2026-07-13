import { AlgorithmGenerator, CellPosition, GridModel } from '../types';
import { getNeighbors, manhattan, cellKey } from '../grid/gridUtils';
import { reconstructPath, computeDisplayLists } from './pathUtils';

interface AStarNode {
  pos: CellPosition;
  g: number;
  f: number;
}

export function* astar(grid: GridModel): AlgorithmGenerator {
  if (!grid.start || !grid.goal) return;

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, CellPosition>();
  const openSet: AStarNode[] = [];
  const openSetKeys = new Set<string>();

  const startKey = cellKey(grid.start);

  gScore.set(startKey, 0);
  fScore.set(startKey, manhattan(grid.start, grid.goal));

  openSet.push({ pos: grid.start, g: 0, f: fScore.get(startKey)! });
  openSetKeys.add(startKey);

  yield { frontier: [grid.start], visited: [], current: null, path: null, done: false };

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const currentKey = cellKey(current.pos);
    openSetKeys.delete(currentKey);

    if (current.pos.row === grid.goal.row && current.pos.col === grid.goal.col) {
      const path = reconstructPath(cameFrom, current.pos);
      yield { frontier: [], visited: [], current: null, path, done: true };
      return;
    }

    const neighbors = getNeighbors(grid, current.pos);
    for (const n of neighbors) {
      const nKey = cellKey(n);
      const tentG = current.g + 1;
      if (tentG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, current.pos);
        gScore.set(nKey, tentG);
        fScore.set(nKey, tentG + manhattan(n, grid.goal!));
        if (!openSetKeys.has(nKey)) {
          openSet.push({ pos: n, g: tentG, f: fScore.get(nKey)! });
          openSetKeys.add(nKey);
        }
      }
    }

    const exploredKeys = new Set(cameFrom.keys());
    const { frontier, visited } = computeDisplayLists(exploredKeys, openSetKeys, currentKey);

    yield { frontier, visited, current: current.pos, path: null, done: false };
  }

  yield { frontier: [], visited: [], current: null, path: null, done: true };
}
