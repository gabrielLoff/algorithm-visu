import { useRef, useEffect, useCallback } from 'react';
import { PathfindingAlgorithmFn, PathfindingAlgorithmStep, GridModel } from '../types';
import { useAlgorithmRunner } from './useAlgorithmRunner';

export function useAnimation(grid: GridModel) {
  const runner = useAlgorithmRunner<GridModel, PathfindingAlgorithmStep>();
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  });

  const run = useCallback(
    (algorithmFn: PathfindingAlgorithmFn, name: string) => {
      runner.run(algorithmFn(gridRef.current), name);
    },
    [runner.run],
  );

  return { ...runner, run };
}
