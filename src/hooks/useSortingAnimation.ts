import { useRef, useEffect, useCallback } from 'react';
import { SortingAlgorithmFn, SortingAlgorithmStep } from '../types';
import { useAlgorithmRunner } from './useAlgorithmRunner';

export function useSortingAnimation(array: number[]) {
  const runner = useAlgorithmRunner<number[], SortingAlgorithmStep>();
  const arrayRef = useRef(array);

  useEffect(() => {
    arrayRef.current = array;
  });

  const run = useCallback(
    (algorithmFn: SortingAlgorithmFn, name: string) => {
      runner.run(algorithmFn(arrayRef.current), name);
    },
    [runner.run],
  );

  return { ...runner, run };
}
