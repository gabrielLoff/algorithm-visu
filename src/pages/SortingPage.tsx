import { useState, useCallback } from 'react';
import { SortingToolbar } from '../components/SortingToolbar';
import { SortingCanvas } from '../components/SortingCanvas';
import { ControlBar } from '../components/ControlBar';
import { useSortingAnimation } from '../hooks/useSortingAnimation';
import { getSortingAlgorithm, getSortingAlgorithms } from '../algorithms/sorting';
import type { SortingAlgorithmInfo } from '../types';
import styles from './SortingPage.module.css';

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 400) + 10);
}

export function SortingPage() {
  const [size, setSize] = useState(50);
  const [array, setArray] = useState(() => generateArray(50));
  const animation = useSortingAnimation(array);
  const algorithms = getSortingAlgorithms();
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]?.name ?? '');

  const algorithmInfo: SortingAlgorithmInfo | null = getSortingAlgorithm(selectedAlgo) ?? null;

  const handleRun = useCallback(() => {
    const algo = getSortingAlgorithm(selectedAlgo);
    if (algo) {
      animation.run(algo.fn, algo.name);
    }
  }, [selectedAlgo, animation]);

  const handleAlgorithmChange = useCallback((name: string) => {
    setSelectedAlgo(name);
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setArray(generateArray(newSize));
  }, []);

  const handleRandomize = useCallback(() => {
    setArray(generateArray(size));
  }, [size]);

  const comparisons = animation.currentStep?.done
    ? animation.steps.filter((s) => s.swapped !== undefined).length
    : null;

  return (
    <div className={styles.page}>
      <SortingToolbar
        selectedAlgorithm={selectedAlgo}
        onAlgorithmChange={handleAlgorithmChange}
        size={size}
        onSizeChange={handleSizeChange}
        onRandomize={handleRandomize}
        isAnimating={animation.isPlaying}
      />
      <SortingCanvas step={animation.currentStep} size={size} />
      <ControlBar
        isPlaying={animation.isPlaying}
        isDone={animation.isDone}
        hasAlgorithm={animation.steps.length > 0}
        speed={animation.speed}
        onPlay={animation.play}
        onPause={animation.pause}
        onStepForward={animation.stepForward}
        onStepBackward={animation.stepBackward}
        onSpeedChange={animation.setSpeed}
        onRun={handleRun}
      />
      {algorithmInfo && (
        <div
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            color: '#9ca3af',
            borderTop: '1px solid #374151',
          }}
        >
          {algorithmInfo.description}
          {comparisons !== null && ` — Steps: ${comparisons}`}
        </div>
      )}
    </div>
  );
}
