import { PathfindingAlgorithmGenerator, CellPosition, GridModel } from '../../types';
import { search, FrontierStrategy } from './search';

function queueStrategy(): FrontierStrategy {
  const items: CellPosition[] = [];
  return {
    add(item: CellPosition) {
      items.push(item);
    },
    remove() {
      return items.shift();
    },
    get size() {
      return items.length;
    },
    entries() {
      return [...items];
    },
  };
}

export function* bfs(grid: GridModel): PathfindingAlgorithmGenerator {
  yield* search(grid, queueStrategy());
}
