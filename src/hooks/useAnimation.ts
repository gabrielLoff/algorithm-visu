import { useState, useRef, useCallback, useEffect } from 'react';
import { AlgorithmFn, AlgorithmStep, GridModel } from '../types';

export function useAnimation(grid: GridModel) {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeedState] = useState(50);
  const [algorithmName, setAlgorithmName] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const run = useCallback(
    (algorithmFn: AlgorithmFn, name: string) => {
      clearInterval_();
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
    [grid, clearInterval_]
  );

  const play = useCallback(() => {
    if (steps.length === 0) return;
    setIsPlaying(true);
  }, [steps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearInterval_();
  }, [clearInterval_]);

  useEffect(() => {
    if (isPlaying) {
      clearInterval_();
      const delay = Math.max(10, 200 - speed * 1.9);
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
      clearInterval_();
    }

    return clearInterval_;
  }, [isPlaying, speed, steps.length, clearInterval_]);

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

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
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
