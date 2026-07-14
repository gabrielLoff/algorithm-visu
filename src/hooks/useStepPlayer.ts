import { useState, useRef, useCallback, useEffect } from 'react';

const MIN_DELAY_MS = 10;
const MAX_DELAY_MS = 200;
/** Maps speed slider (1–100) to interval delay (~198ms → ~10ms) */
const SPEED_SCALE = 1.9;

export function useStepPlayer<TStep>() {
  const [steps, setSteps] = useState<TStep[]>([]);
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

  const currentStep: TStep | null =
    steps.length > 0 && currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;

  return {
    steps,
    setSteps,
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    isDone,
    speed,
    setSpeed,
    algorithmName,
    setAlgorithmName,
    play,
    pause,
    stepForward,
    stepBackward,
    currentStep,
    stopTimer,
  };
}
