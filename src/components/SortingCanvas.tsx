import { useRef, useEffect } from 'react';
import { SortingAlgorithmStep } from '../types';
import { COLORS } from '../constants/colors';
import styles from './SortingCanvas.module.css';

interface SortingCanvasProps {
  step: SortingAlgorithmStep | null;
  size: number;
}

const CANVAS_HEIGHT = 400;
const PADDING = 4;

export function SortingCanvas({ step, size }: SortingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const array = step ? step.array : [];
    const compared = step?.compared ?? null;
    const swapped = step?.swapped;

    const width = canvas.width;
    const height = canvas.height;
    const maxVal = array.length > 0 ? Math.max(...array) : 1;
    const barWidth = Math.max(2, (width - PADDING * 2) / array.length - 1);

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < array.length; i++) {
      const barHeight = (array[i] / maxVal) * (height - PADDING * 2);
      const x = PADDING + i * ((width - PADDING * 2) / array.length);

      if (swapped && (swapped[0] === i || swapped[1] === i)) {
        ctx.fillStyle = COLORS.path;
      } else if (compared && (compared[0] === i || compared[1] === i)) {
        ctx.fillStyle = COLORS.current;
      } else {
        ctx.fillStyle = COLORS.visited;
      }

      ctx.fillRect(x, height - PADDING - barHeight, barWidth, barHeight);
    }
  }, [step, size]);

  const canvasWidth = Math.max(400, size * 6);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
      />
    </div>
  );
}
