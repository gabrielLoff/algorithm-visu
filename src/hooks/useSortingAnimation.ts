import { useRef, useEffect, useCallback } from 'react';
import { SortingAlgorithmFn, SortingAlgorithmStep } from '../types';
import { useStepPlayer } from './useStepPlayer';

export function useSortingAnimation(array: number[]) {
  const player = useStepPlayer<SortingAlgorithmStep>();
  const { stopTimer, setAlgorithmName, setSteps, setCurrentStepIndex } = player;
  const arrayRef = useRef(array);

  useEffect(() => {
    arrayRef.current = array;
  });

  const run = useCallback(
    (algorithmFn: SortingAlgorithmFn, name: string) => {
      stopTimer();
      setAlgorithmName(name);

      const collected: SortingAlgorithmStep[] = [];
      const gen = algorithmFn(arrayRef.current);

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
