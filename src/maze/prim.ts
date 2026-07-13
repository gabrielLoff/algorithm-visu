import { GridModel, CellType } from '../types';
import { cellKey } from '../grid/gridUtils';
import { ensureSolvable } from './mazeUtils';

const DIRS: [number, number][] = [
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
];

export function prim(grid: GridModel): GridModel {
  const cells = grid.cells.map((row) => [...row]);
  const { rows, cols } = grid;

  const passage = new Set<string>();

  const startR = 1 + 2 * Math.floor(Math.random() * Math.floor((rows - 2) / 2));
  const startC = 1 + 2 * Math.floor(Math.random() * Math.floor((cols - 2) / 2));
  passage.add(cellKey({ row: startR, col: startC }));

  const frontier: [number, number, number, number][] = [];

  function addFrontier(r: number, c: number) {
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr <= 0 || nr >= rows - 1 || nc <= 0 || nc >= cols - 1) continue;
      const nKey = cellKey({ row: nr, col: nc });
      if (passage.has(nKey)) continue;
      const wr = r + dr / 2;
      const wc = c + dc / 2;
      frontier.push([nr, nc, wr, wc]);
    }
  }

  addFrontier(startR, startC);

  while (frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length);
    const [cr, cc, wr, wc] = frontier[idx];
    frontier.splice(idx, 1);

    const cKey = cellKey({ row: cr, col: cc });
    if (passage.has(cKey)) continue;

    passage.add(cKey);
    passage.add(cellKey({ row: wr, col: wc }));

    addFrontier(cr, cc);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = cells[r][c] as CellType;
      if (current !== 'default' && current !== 'gravel') continue;
      if (!passage.has(cellKey({ row: r, col: c }))) {
        cells[r][c] = 'wall';
      }
    }
  }

  return ensureSolvable({ ...grid, cells });
}
