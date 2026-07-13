import { useRef, useEffect, useCallback } from 'react';
import { GridModel, AlgorithmStep, CellPosition } from '../types';
import { renderFrame } from '../renderer/canvasRenderer';
import styles from './GridCanvas.module.css';

interface GridCanvasProps {
  grid: GridModel;
  step: AlgorithmStep | null;
  onCellClick: (pos: CellPosition) => void;
  isAnimating: boolean;
}

const CELL_SIZE = 22;

export function GridCanvas({ grid, step, onCellClick, isAnimating }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseDownRef = useRef(false);

  const width = grid.cols * CELL_SIZE;
  const height = grid.rows * CELL_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderFrame(ctx, grid, step, CELL_SIZE);
  }, [grid, step]);

  const getCellPos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): CellPosition | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);
      if (row >= 0 && row < grid.rows && col >= 0 && col < grid.cols) {
        return { row, col };
      }
      return null;
    },
    [grid.rows, grid.cols]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isAnimating) return;
      mouseDownRef.current = true;
      const pos = getCellPos(e);
      if (pos) onCellClick(pos);
    },
    [isAnimating, getCellPos, onCellClick]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isAnimating) return;
      if (mouseDownRef.current) {
        const pos = getCellPos(e);
        if (pos) onCellClick(pos);
      }
    },
    [isAnimating, getCellPos, onCellClick]
  );

  const handleMouseUp = useCallback(() => {
    mouseDownRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseDownRef.current = false;
  }, []);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isAnimating ? 'default' : 'crosshair' }}
      />
    </div>
  );
}
