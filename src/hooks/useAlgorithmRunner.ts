import { useRef, useEffect, useCallback } from 'react';
import { useStepPlayer } from './useStepPlayer';

export function useAlgorithmRunner<TData, TStep>() {
  const player = useStepPlayer<TStep>();
  const { stopTimer, setAlgorithmName, setSteps, setCurrentStepIndex } = player;
  const dataRef = useRef<TData | undefined>(undefined);

  useEffect(() => {
    dataRef.current = undefined;
  });

  const run = useCallback(
    (generator: Generator<TStep, void, undefined>, name: string) => {
      stopTimer();
      setAlgorithmName(name);

      const collected: TStep[] = [];
      for (const step of generator) {
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
