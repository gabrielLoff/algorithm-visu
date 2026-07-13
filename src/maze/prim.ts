import { GridModel, CellType } from '../types';
import { cellKey, getNeighbors } from '../grid/gridUtils';
import { ensureSolvable } from './mazeUtils';

interface FrontierEntry {
  cellRow: number;
  cellCol: number;
  wallRow: number;
  wallCol: number;
}

export function prim(grid: GridModel): GridModel {
  const cells = grid.cells.map((row) => [...row]);
  const { rows, cols } = grid;

  const passage = new Set<string>();

  const startR = 1 + 2 * Math.floor(Math.random() * Math.floor((rows - 2) / 2));
  const startC = 1 + 2 * Math.floor(Math.random() * Math.floor((cols - 2) / 2));
  passage.add(cellKey({ row: startR, col: startC }));

  const frontier: FrontierEntry[] = [];

  for (const n of getNeighbors(grid, { row: startR, col: startC }, 2)) {
    const nr = n.pos.row;
    const nc = n.pos.col;
    if (nr <= 0 || nr >= rows - 1 || nc <= 0 || nc >= cols - 1) continue;
    const nKey = cellKey({ row: nr, col: nc });
    if (passage.has(nKey)) continue;
    const wr = startR + (nr - startR) / 2;
    const wc = startC + (nc - startC) / 2;
    frontier.push({ cellRow: nr, cellCol: nc, wallRow: wr, wallCol: wc });
  }

  while (frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length);
    const { cellRow: cr, cellCol: cc, wallRow: wr, wallCol: wc } = frontier[idx];
    frontier.splice(idx, 1);

    const cKey = cellKey({ row: cr, col: cc });
    if (passage.has(cKey)) continue;

    passage.add(cKey);
    passage.add(cellKey({ row: wr, col: wc }));

    for (const n of getNeighbors(grid, { row: cr, col: cc }, 2)) {
      const nr = n.pos.row;
      const nc = n.pos.col;
      if (nr <= 0 || nr >= rows - 1 || nc <= 0 || nc >= cols - 1) continue;
      const nKey = cellKey({ row: nr, col: nc });
      if (passage.has(nKey)) continue;
      const wr2 = cr + (nr - cr) / 2;
      const wc2 = cc + (nc - cc) / 2;
      frontier.push({ cellRow: nr, cellCol: nc, wallRow: wr2, wallCol: wc2 });
    }
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
