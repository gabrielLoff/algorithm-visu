import { CellType, CellPosition, GridModel } from '../types';

export function createGrid(rows: number, cols: number): GridModel {
  const cells: CellType[][] = [];
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      cells[r][c] = 'empty';
    }
  }

  const midRow = Math.floor(rows / 2);
  const startCol = Math.floor(cols / 4);
  const goalCol = Math.floor((3 * cols) / 4);

  const start: CellPosition = { row: midRow, col: startCol };
  const goal: CellPosition = { row: midRow, col: goalCol };

  cells[start.row][start.col] = 'start';
  cells[goal.row][goal.col] = 'goal';

  return { rows, cols, cells, start, goal };
}

export function setCell(grid: GridModel, pos: CellPosition, type: CellType): GridModel {
  const cells = grid.cells.map((row) => [...row]);
  cells[pos.row][pos.col] = type;
  return { ...grid, cells };
}

export function toggleWall(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'wall') {
    return setCell(grid, pos, 'empty');
  }
  if (current === 'empty') {
    return setCell(grid, pos, 'wall');
  }
  return grid;
}

export function setStart(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'start' || current === 'wall') return grid;

  let cells = grid.cells.map((row) => [...row]);
  if (grid.start) {
    cells[grid.start.row][grid.start.col] = 'empty';
  }
  cells[pos.row][pos.col] = 'start';
  return { ...grid, cells, start: { ...pos } };
}

export function setGoal(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'goal' || current === 'wall') return grid;

  let cells = grid.cells.map((row) => [...row]);
  if (grid.goal) {
    cells[grid.goal.row][grid.goal.col] = 'empty';
  }
  cells[pos.row][pos.col] = 'goal';
  return { ...grid, cells, goal: { ...pos } };
}

export function clearWalls(grid: GridModel): GridModel {
  const cells = grid.cells.map((row) =>
    row.map((cell) => {
      if (cell === 'wall') return 'empty' as CellType;
      return cell;
    })
  );
  return { ...grid, cells };
}

export function resetGrid(grid: GridModel): GridModel {
  return createGrid(grid.rows, grid.cols);
}
