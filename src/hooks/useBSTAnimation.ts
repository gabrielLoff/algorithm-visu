import { useRef, useEffect, useCallback } from 'react';
import { BSTAlgorithmFn, BSTAlgorithmStep, BSTNode } from '../types';
import { useAlgorithmRunner } from './useAlgorithmRunner';

export function useBSTAnimation(tree: BSTNode | null) {
  const runner = useAlgorithmRunner<BSTNode | null, BSTAlgorithmStep>();
  const treeRef = useRef(tree);

  useEffect(() => {
    treeRef.current = tree;
  });

  const run = useCallback(
    (algorithmFn: BSTAlgorithmFn, name: string, value: number) => {
      runner.run(algorithmFn(treeRef.current, value), name);
    },
    [runner.run],
  );

  return { ...runner, run };
}
