import { CellPosition } from '../../types';
import { cellKey, parseCellKey } from '../../grid/gridUtils';

export function reconstructPath(
  cameFrom: Map<string, CellPosition>,
  current: CellPosition,
): CellPosition[] {
  const path: CellPosition[] = [current];
  let key = cellKey(current);
  while (cameFrom.has(key)) {
    const prev = cameFrom.get(key)!;
    path.push(prev);
    key = cellKey(prev);
  }
  path.reverse();
  return path;
}

/**
 * Produces display arrays for the current algorithm step.
 *
 * `frontier` contains all positions waiting to be explored.
 * `visited` contains explored positions minus those still in frontier or the current cell.
 */
export function computeDisplayLists(
  explored: Set<string>,
  frontierKeys: Set<string>,
  currentKey: string | null,
): { frontier: CellPosition[]; visited: CellPosition[] } {
  const frontier: CellPosition[] = [];
  for (const key of frontierKeys) {
    frontier.push(parseCellKey(key));
  }

  const visited: CellPosition[] = [];
  for (const key of explored) {
    if (!frontierKeys.has(key) && key !== currentKey) {
      visited.push(parseCellKey(key));
    }
  }

  return { frontier, visited };
}
