import { useRef, useEffect, useCallback } from 'react';
import { PathfindingAlgorithmFn, PathfindingAlgorithmStep, GridModel } from '../types';
import { useStepPlayer } from './useStepPlayer';

export function useAnimation(grid: GridModel) {
  const player = useStepPlayer<PathfindingAlgorithmStep>();
  const { stopTimer, setAlgorithmName, setSteps, setCurrentStepIndex } = player;
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  });

  const run = useCallback(
    (algorithmFn: PathfindingAlgorithmFn, name: string) => {
      stopTimer();
      setAlgorithmName(name);

      const collected: PathfindingAlgorithmStep[] = [];
      const gen = algorithmFn(gridRef.current);

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
