import { useState, useCallback } from 'react';
import { Toolbar } from '../components/Toolbar';
import { GridCanvas } from '../components/GridCanvas';
import { ControlBar } from '../components/ControlBar';
import { InfoPanel } from '../components/InfoPanel';
import { useGrid } from '../hooks/useGrid';
import { useAnimation } from '../hooks/useAnimation';
import { getAlgorithm } from '../algorithms';
import { getMaze, getMazes } from '../maze';
import type { AlgorithmInfo } from '../types';
import styles from './PathfindingPage.module.css';

const ROWS = 25;
const COLS = 50;

export function PathfindingPage() {
  const { grid, setGrid, mode, setMode, handleCellClick, handleClearAll, handleReset } = useGrid(ROWS, COLS);
  const animation = useAnimation(grid);
  const [selectedAlgo, setSelectedAlgo] = useState('A*');
  const [selectedMaze, setSelectedMaze] = useState(getMazes()[0].name);

  const algorithmInfo: AlgorithmInfo | null = getAlgorithm(selectedAlgo) ?? null;
  const activeInfo = animation.algorithmName ? algorithmInfo : null;

  const handleRun = useCallback(() => {
    const algo = getAlgorithm(selectedAlgo);
    if (algo) {
      animation.run(algo.fn, algo.name);
    }
  }, [selectedAlgo, animation.run]);

  const handleAlgorithmChange = useCallback((name: string) => {
    setSelectedAlgo(name);
  }, []);

  const handleMazeChange = useCallback((name: string) => {
    setSelectedMaze(name);
  }, []);

  const handleGenerateMaze = useCallback(() => {
    const maze = getMaze(selectedMaze);
    if (maze) {
      animation.pause();
      setGrid((prev) => maze.fn(prev));
    }
  }, [selectedMaze, animation, setGrid]);

  return (
    <div className={styles.page}>
      <Toolbar
        selectedAlgorithm={selectedAlgo}
        onAlgorithmChange={handleAlgorithmChange}
        selectedMaze={selectedMaze}
        onMazeChange={handleMazeChange}
        onGenerateMaze={handleGenerateMaze}
        mode={mode}
        onModeChange={setMode}
        onClearAll={handleClearAll}
        onReset={handleReset}
        isAnimating={animation.isPlaying}
      />
      <GridCanvas
        grid={grid}
        step={animation.currentStep}
        onCellClick={handleCellClick}
        isAnimating={animation.isPlaying}
      />
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
      <InfoPanel
        step={animation.currentStep}
        algorithmInfo={activeInfo}
        hasAlgorithm={animation.steps.length > 0}
        grid={grid}
      />
    </div>
  );
}
