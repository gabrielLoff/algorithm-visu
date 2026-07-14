import { CellType, CellPosition, GridModel, PathfindingAlgorithmStep } from '../types';
import { COLORS } from '../constants/colors';

const PATH_WIDTH_RATIO = 0.6;
const MARKER_RADIUS_RATIO = 0.35;

/**
 * Renders one frame of the algorithm visualization.
 *
 * @param ctx - Canvas 2D rendering context
 * @param grid - Static cell state (walls, start, goal positions)
 * @param step - Dynamic algorithm state (frontier, visited, current, path)
 * @param cellSize - Pixel size of each grid cell
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  grid: GridModel,
  step: PathfindingAlgorithmStep | null,
  cellSize: number,
): void {
  const width = grid.cols * cellSize;
  const height = grid.rows * cellSize;

  ctx.clearRect(0, 0, width, height);

  fillCellsOfType(ctx, grid, cellSize, 'wall', COLORS.wall);
  fillCellsOfType(ctx, grid, cellSize, 'gravel', COLORS.gravel);
  drawGridLines(ctx, grid, cellSize);

  if (step) {
    drawVisitedCells(ctx, step.visited, cellSize);
    drawFrontierCells(ctx, step.frontier, cellSize);
    if (step.current) {
      drawCurrentCell(ctx, step.current, cellSize);
    }
    if (step.path) {
      drawPath(ctx, step.path, cellSize);
    }
  }

  drawStartGoal(ctx, grid, cellSize);
}

function fillCellsOfType(
  ctx: CanvasRenderingContext2D,
  grid: GridModel,
  cellSize: number,
  type: CellType,
  color: string,
): void {
  ctx.fillStyle = color;
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (grid.cells[r][c] === type) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawGridLines(ctx: CanvasRenderingContext2D, grid: GridModel, cellSize: number): void {
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 0.5;

  for (let r = 0; r <= grid.rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellSize);
    ctx.lineTo(grid.cols * cellSize, r * cellSize);
    ctx.stroke();
  }

  for (let c = 0; c <= grid.cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellSize, 0);
    ctx.lineTo(c * cellSize, grid.rows * cellSize);
    ctx.stroke();
  }
}

function drawVisitedCells(
  ctx: CanvasRenderingContext2D,
  visited: CellPosition[],
  cellSize: number,
): void {
  ctx.fillStyle = COLORS.visited;
  for (const pos of visited) {
    ctx.fillRect(pos.col * cellSize, pos.row * cellSize, cellSize, cellSize);
  }
}

function drawFrontierCells(
  ctx: CanvasRenderingContext2D,
  frontier: CellPosition[],
  cellSize: number,
): void {
  ctx.fillStyle = COLORS.frontier;
  for (const pos of frontier) {
    ctx.fillRect(pos.col * cellSize, pos.row * cellSize, cellSize, cellSize);
  }
}

function drawCurrentCell(
  ctx: CanvasRenderingContext2D,
  current: CellPosition,
  cellSize: number,
): void {
  ctx.fillStyle = COLORS.current;
  ctx.fillRect(current.col * cellSize, current.row * cellSize, cellSize, cellSize);
}

function drawPath(ctx: CanvasRenderingContext2D, path: CellPosition[], cellSize: number): void {
  if (path.length === 0) return;

  ctx.strokeStyle = COLORS.path;
  ctx.lineWidth = cellSize * PATH_WIDTH_RATIO;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  const first = path[0];
  ctx.moveTo(first.col * cellSize + cellSize / 2, first.row * cellSize + cellSize / 2);

  for (let i = 1; i < path.length; i++) {
    const p = path[i];
    ctx.lineTo(p.col * cellSize + cellSize / 2, p.row * cellSize + cellSize / 2);
  }
  ctx.stroke();
}

function drawStartGoal(ctx: CanvasRenderingContext2D, grid: GridModel, cellSize: number): void {
  const radius = cellSize * MARKER_RADIUS_RATIO;

  if (grid.start) {
    ctx.fillStyle = COLORS.start;
    ctx.beginPath();
    ctx.arc(
      grid.start.col * cellSize + cellSize / 2,
      grid.start.row * cellSize + cellSize / 2,
      radius,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  if (grid.goal) {
    ctx.fillStyle = COLORS.goal;
    ctx.beginPath();
    ctx.arc(
      grid.goal.col * cellSize + cellSize / 2,
      grid.goal.row * cellSize + cellSize / 2,
      radius,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
