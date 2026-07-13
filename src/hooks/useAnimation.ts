import { useState, useRef, useCallback, useEffect } from 'react';
import { AlgorithmFn, AlgorithmStep, GridModel } from '../types';

const MIN_DELAY_MS = 10;
const MAX_DELAY_MS = 200;
const SPEED_SCALE = 1.9;

export function useAnimation(grid: GridModel) {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithmName, setAlgorithmName] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const run = useCallback(
    (algorithmFn: AlgorithmFn, name: string) => {
      stopTimer();
      setAlgorithmName(name);

      const collected: AlgorithmStep[] = [];
      const gen = algorithmFn(grid);

      for (const step of gen) {
        collected.push(step);
      }

      setSteps(collected);
      setCurrentStepIndex(0);
      setIsDone(false);
      setIsPlaying(false);
    },
    [grid, stopTimer]
  );

  const play = useCallback(() => {
    if (steps.length === 0) return;
    setIsPlaying(true);
  }, [steps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (isPlaying) {
      stopTimer();
      const delay = Math.max(MIN_DELAY_MS, MAX_DELAY_MS - speed * SPEED_SCALE);
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            setIsDone(true);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      stopTimer();
    }

    return stopTimer;
  }, [isPlaying, speed, steps.length, stopTimer]);

  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) {
        setIsDone(true);
        return prev;
      }
      return prev + 1;
    });
    setIsPlaying(false);
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
    setIsPlaying(false);
    setIsDone(false);
  }, []);

  const currentStep: AlgorithmStep | null =
    steps.length > 0 && currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;

  return {
    steps,
    currentStepIndex,
    isPlaying,
    isDone,
    speed,
    algorithmName,
    play,
    pause,
    stepForward,
    stepBackward,
    setSpeed,
    run,
    currentStep,
  };
}
