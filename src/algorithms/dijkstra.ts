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

export function* dijkstra(grid: GridModel): AlgorithmGenerator {
  if (!grid.start || !grid.goal) return;

  const dist = new Map<string, number>();
  const cameFrom = new Map<string, CellPosition>();
  const unvisited = new Set<string>();
  const frontierSet = new Set<string>();

  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (grid.cells[r][c] !== 'wall') {
        unvisited.add(`${r},${c}`);
      }
    }
  }

  const startKey = `${grid.start.row},${grid.start.col}`;
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
        const [r, c] = key.split(',').map(Number);
        minNode = { row: r, col: c };
      }
    }

    if (!minNode) break;
    const currentKey = `${minNode.row},${minNode.col}`;
    frontierSet.delete(currentKey);
    unvisited.delete(currentKey);

    if (minNode.row === grid.goal.row && minNode.col === grid.goal.col) {
      const path = reconstructPath(cameFrom, minNode);
      yield { frontier: [], visited: [], current: null, path, done: true };
      return;
    }

    const neighbors = getNeighbors(grid, minNode);
    for (const n of neighbors) {
      const nKey = `${n.row},${n.col}`;
      if (!unvisited.has(nKey)) continue;
      const alt = minDist + 1;
      if (alt < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, alt);
        cameFrom.set(nKey, minNode);
        frontierSet.add(nKey);
      }
    }

    const frontier: CellPosition[] = [];
    for (const key of frontierSet) {
      const [r, c] = key.split(',').map(Number);
      frontier.push({ row: r, col: c });
    }

    const visited: CellPosition[] = [];
    for (const [key] of cameFrom) {
      if (!frontierSet.has(key) && unvisited.has(key) === false) {
        const [r, c] = key.split(',').map(Number);
        visited.push({ row: r, col: c });
      }
    }

    yield { frontier, visited, current: minNode, path: null, done: false };
  }

  yield { frontier: [], visited: [], current: null, path: null, done: true };
}
