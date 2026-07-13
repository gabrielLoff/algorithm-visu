import { CellPosition, GridModel, AlgorithmStep } from '../types';

const COLORS = {
  empty: '#f0f0f0',
  wall: '#374151',
  start: '#22c55e',
  goal: '#ef4444',
  visited: 'rgba(103, 232, 249, 0.4)',
  frontier: 'rgba(253, 224, 71, 0.6)',
  current: '#a855f7',
  path: '#facc15',
  gridLine: '#d1d5db',
};

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  grid: GridModel,
  step: AlgorithmStep | null,
  cellSize: number
): void {
  const width = grid.cols * cellSize;
  const height = grid.rows * cellSize;

  ctx.clearRect(0, 0, width, height);

  drawGridBackground(ctx, grid, cellSize);
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

function drawGridBackground(
  ctx: CanvasRenderingContext2D,
  grid: GridModel,
  cellSize: number
): void {
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const cell = grid.cells[r][c];
      if (cell === 'wall') {
        ctx.fillStyle = COLORS.wall;
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawGridLines(
  ctx: CanvasRenderingContext2D,
  grid: GridModel,
  cellSize: number
): void {
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
  cellSize: number
): void {
  ctx.fillStyle = COLORS.visited;
  for (const pos of visited) {
    ctx.fillRect(pos.col * cellSize, pos.row * cellSize, cellSize, cellSize);
  }
}

function drawFrontierCells(
  ctx: CanvasRenderingContext2D,
  frontier: CellPosition[],
  cellSize: number
): void {
  ctx.fillStyle = COLORS.frontier;
  for (const pos of frontier) {
    ctx.fillRect(pos.col * cellSize, pos.row * cellSize, cellSize, cellSize);
  }
}

function drawCurrentCell(
  ctx: CanvasRenderingContext2D,
  current: CellPosition,
  cellSize: number
): void {
  ctx.fillStyle = COLORS.current;
  ctx.fillRect(current.col * cellSize, current.row * cellSize, cellSize, cellSize);
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  path: CellPosition[],
  cellSize: number
): void {
  if (path.length === 0) return;

  ctx.strokeStyle = COLORS.path;
  ctx.lineWidth = cellSize * 0.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  const first = path[0];
  ctx.moveTo(
    first.col * cellSize + cellSize / 2,
    first.row * cellSize + cellSize / 2
  );

  for (let i = 1; i < path.length; i++) {
    const p = path[i];
    ctx.lineTo(
      p.col * cellSize + cellSize / 2,
      p.row * cellSize + cellSize / 2
    );
  }
  ctx.stroke();
}

function drawStartGoal(
  ctx: CanvasRenderingContext2D,
  grid: GridModel,
  cellSize: number
): void {
  const radius = cellSize * 0.35;

  if (grid.start) {
    ctx.fillStyle = COLORS.start;
    ctx.beginPath();
    ctx.arc(
      grid.start.col * cellSize + cellSize / 2,
      grid.start.row * cellSize + cellSize / 2,
      radius,
      0,
      Math.PI * 2
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
      Math.PI * 2
    );
    ctx.fill();
  }
}

export function getCanvasSize(grid: GridModel, cellSize: number): { width: number; height: number } {
  return {
    width: grid.cols * cellSize,
    height: grid.rows * cellSize,
  };
}
