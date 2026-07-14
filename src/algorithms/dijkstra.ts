import { AlgorithmGenerator, CellPosition, GridModel } from '../types';
import { getNeighbors, cellKey, parseCellKey } from '../grid/gridUtils';
import { reconstructPath, computeDisplayLists } from './pathUtils';

export function* dijkstra(grid: GridModel): AlgorithmGenerator {
  if (!grid.start || !grid.goal) return;

  const dist = new Map<string, number>();
  const cameFrom = new Map<string, CellPosition>();
  const unvisited = new Set<string>();
  const frontierSet = new Set<string>();

  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (grid.cells[r][c] !== 'wall') {
        unvisited.add(cellKey({ row: r, col: c }));
      }
    }
  }

  const startKey = cellKey(grid.start);
  dist.set(startKey, 0);
  frontierSet.add(startKey);

  yield { frontier: [grid.start], visited: [], current: null, path: null, done: false };

  while (frontierSet.size > 0) {
    let minNode: CellPosition | null = null;
    let minDist = Infinity;
    for (const key of frontierSet) {
      const d = dist.get(key) ?? Infinity;
      if (d < minDist) {
        minDist = d;
        minNode = parseCellKey(key);
      }
    }

    if (!minNode) break;
    const currentKey = cellKey(minNode);
    frontierSet.delete(currentKey);
    unvisited.delete(currentKey);

    if (minNode.row === grid.goal.row && minNode.col === grid.goal.col) {
      const path = reconstructPath(cameFrom, minNode);
      yield { frontier: [], visited: [], current: null, path, done: true };
      return;
    }

    const neighbors = getNeighbors(grid, minNode);
    for (const n of neighbors) {
      const nKey = cellKey(n.pos);
      if (!unvisited.has(nKey)) continue;
      const alt = minDist + n.cost;
      if (alt < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, alt);
        cameFrom.set(nKey, minNode);
        frontierSet.add(nKey);
      }
    }

    const explored = new Set(cameFrom.keys());
    const { frontier, visited } = computeDisplayLists(explored, frontierSet, currentKey);

    yield { frontier, visited, current: minNode, path: null, done: false };
  }

  yield { frontier: [], visited: [], current: null, path: null, done: true };
}
