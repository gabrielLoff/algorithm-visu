import { CellType, CellPosition, GridModel } from '../types';

export function createGrid(rows: number, cols: number): GridModel {
  const cells: CellType[][] = [];
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      cells[r][c] = 'default';
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

export function setWall(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'wall' || current === 'start' || current === 'goal') return grid;
  return setCell(grid, pos, 'wall');
}

export function setGravel(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'gravel' || current === 'start' || current === 'goal') return grid;
  return setCell(grid, pos, 'gravel');
}

export function setDefault(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'default' || current === 'start' || current === 'goal') return grid;
  return setCell(grid, pos, 'default');
}

export function setStart(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'start' || current === 'wall' || current === 'gravel') return grid;

  const cells = grid.cells.map((row) => [...row]);
  if (grid.start) {
    cells[grid.start.row][grid.start.col] = 'default';
  }
  cells[pos.row][pos.col] = 'start';
  return { ...grid, cells, start: { ...pos } };
}

export function setGoal(grid: GridModel, pos: CellPosition): GridModel {
  const current = grid.cells[pos.row][pos.col];
  if (current === 'goal' || current === 'wall' || current === 'gravel') return grid;

  const cells = grid.cells.map((row) => [...row]);
  if (grid.goal) {
    cells[grid.goal.row][grid.goal.col] = 'default';
  }
  cells[pos.row][pos.col] = 'goal';
  return { ...grid, cells, goal: { ...pos } };
}

export function clearAll(grid: GridModel): GridModel {
  const cells = grid.cells.map((row) =>
    row.map((cell) => {
      if (cell === 'wall' || cell === 'gravel') return 'default';
      return cell;
    })
  );
  return { ...grid, cells };
}

export function resetGrid(grid: GridModel): GridModel {
  return createGrid(grid.rows, grid.cols);
}
