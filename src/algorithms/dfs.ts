import { PathfindingAlgorithmGenerator, CellPosition, GridModel } from '../types';
import { search, FrontierStrategy } from './search';

function stackStrategy(): FrontierStrategy {
  const items: CellPosition[] = [];
  return {
    add(item: CellPosition) {
      items.push(item);
    },
    remove() {
      return items.pop();
    },
    get size() {
      return items.length;
    },
    entries() {
      return items;
    },
  };
}

export function* dfs(grid: GridModel): PathfindingAlgorithmGenerator {
  yield* search(grid, stackStrategy());
}
