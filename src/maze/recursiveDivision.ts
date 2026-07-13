import { GridModel, CellType } from '../types';
import { ensureSolvable } from './mazeUtils';

export function recursiveDivision(grid: GridModel): GridModel {
  const cells = grid.cells.map((row) => [...row]);

  function divide(r1: number, r2: number, c1: number, c2: number) {
    const height = r2 - r1;
    const width = c2 - c1;

    if (height < 3 || width < 3) return;

    const horizontal =
      height > width || (height === width && Math.random() < 0.5);

    if (horizontal) {
      const wallRow = r1 + 1 + Math.floor(Math.random() * (height - 2));
      const passageCol = c1 + Math.floor(Math.random() * width);

      for (let c = c1; c < c2; c++) {
        if (c === passageCol) continue;
        const current = cells[wallRow][c] as CellType;
        if (current !== 'wall' && current !== 'start' && current !== 'goal') {
          cells[wallRow][c] = 'wall';
        }
      }

      divide(r1, wallRow, c1, c2);
      divide(wallRow + 1, r2, c1, c2);
    } else {
      const wallCol = c1 + 1 + Math.floor(Math.random() * (width - 2));
      const passageRow = r1 + Math.floor(Math.random() * height);

      for (let r = r1; r < r2; r++) {
        if (r === passageRow) continue;
        const current = cells[r][wallCol] as CellType;
        if (current !== 'wall' && current !== 'start' && current !== 'goal') {
          cells[r][wallCol] = 'wall';
        }
      }

      divide(r1, r2, c1, wallCol);
      divide(r1, r2, wallCol + 1, c2);
    }
  }

  divide(0, grid.rows, 0, grid.cols);

  return ensureSolvable({ ...grid, cells });
}
