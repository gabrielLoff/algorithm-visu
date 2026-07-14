import { useRef, useEffect, useCallback } from 'react';
import { BSTAlgorithmFn, BSTAlgorithmStep, BSTNode } from '../types';
import { useStepPlayer } from './useStepPlayer';

export function useBSTAnimation(tree: BSTNode | null) {
  const player = useStepPlayer<BSTAlgorithmStep>();
  const { stopTimer, setAlgorithmName, setSteps, setCurrentStepIndex } = player;
  const treeRef = useRef(tree);

  useEffect(() => {
    treeRef.current = tree;
  });

  const run = useCallback(
    (algorithmFn: BSTAlgorithmFn, name: string, value: number) => {
      stopTimer();
      setAlgorithmName(name);

      const collected: BSTAlgorithmStep[] = [];
      const gen = algorithmFn(treeRef.current, value);

      for (const step of gen) {
        collected.push(step);
      }

      setSteps(collected);
      setCurrentStepIndex(0);
    },
    [stopTimer, setAlgorithmName, setSteps, setCurrentStepIndex],
  );

  return {
    steps: player.steps,
    currentStepIndex: player.currentStepIndex,
    isPlaying: player.isPlaying,
    isDone: player.isDone,
    speed: player.speed,
    algorithmName: player.algorithmName,
    play: player.play,
    pause: player.pause,
    stepForward: player.stepForward,
    stepBackward: player.stepBackward,
    setSpeed: player.setSpeed,
    run,
    currentStep: player.currentStep,
  };
}
