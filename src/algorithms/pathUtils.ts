import { CellPosition } from '../types';
import { cellKey, parseCellKey } from '../grid/gridUtils';

export function reconstructPath(
  cameFrom: Map<string, CellPosition>,
  current: CellPosition
): CellPosition[] {
  const path: CellPosition[] = [current];
  let key = cellKey(current);
  while (cameFrom.has(key)) {
    const prev = cameFrom.get(key)!;
    path.unshift(prev);
    key = cellKey(prev);
  }
  return path;
}

export function computeDisplayLists(
  exploredKeys: Set<string>,
  frontierKeys: Set<string>,
  currentKey: string | null,
): { frontier: CellPosition[]; visited: CellPosition[] } {
  const frontier: CellPosition[] = [];
  for (const key of frontierKeys) {
    frontier.push(parseCellKey(key));
  }

  const visited: CellPosition[] = [];
  for (const key of exploredKeys) {
    if (!frontierKeys.has(key) && key !== currentKey) {
      visited.push(parseCellKey(key));
    }
  }

  return { frontier, visited };
}
