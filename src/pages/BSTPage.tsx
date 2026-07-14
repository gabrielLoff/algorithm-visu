import { useState, useCallback } from 'react';
import { BSTToolbar } from '../components/BSTToolbar';
import { BSTCanvas } from '../components/BSTCanvas';
import { ControlBar } from '../components/ControlBar';
import { useBSTAnimation } from '../hooks/useBSTAnimation';
import { getBSTAlgorithm, getBSTAlgorithms } from '../algorithms/bst';
import { createNode, insertValue, countNodes } from '../algorithms/bst/treeUtils';
import { navigateHome } from '../visualizers';
import type { BSTNode } from '../types';
import styles from './BSTPage.module.css';

export function BSTPage() {
  const [tree, setTree] = useState<BSTNode | null>(null);
  const [value, setValue] = useState(50);
  const animation = useBSTAnimation(tree);
  const algorithms = getBSTAlgorithms();
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]?.name ?? '');

  const handleRun = useCallback(() => {
    const algo = getBSTAlgorithm(selectedAlgo);
    if (algo) {
      animation.run(algo.fn, algo.name, value);
    }
  }, [selectedAlgo, value, animation.run]);

  const handleAlgorithmChange = useCallback((name: string) => {
    setSelectedAlgo(name);
  }, []);

  const handleClear = useCallback(() => {
    setTree(null);
  }, []);

  const handleNodeClick = useCallback((nodeValue: number) => {
    setValue(nodeValue);
  }, []);

  const lastStep = animation.currentStep;

  const buildRandomTree = () => {
    const t = createNode(Math.floor(Math.random() * 100));
    for (let i = 0; i < 7; i++) {
      insertValue(t, Math.floor(Math.random() * 100));
    }
    setTree(t);
  };

  return (
    <div className={styles.page}>
      <BSTToolbar
        selectedAlgorithm={selectedAlgo}
        onAlgorithmChange={handleAlgorithmChange}
        value={value}
        onValueChange={setValue}
        onRun={handleRun}
        onClear={handleClear}
        isAnimating={animation.isPlaying}
        message={lastStep?.message ?? ''}
      />
      <BSTCanvas step={lastStep} tree={tree} onNodeClick={handleNodeClick} />
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
      <div className={styles.footer}>
        <button className={styles.homeBtn} onClick={navigateHome}>
          Home
        </button>
        <span className={styles.status}>
          {tree
            ? `Tree has ${countNodes(tree)} nodes`
            : "Tree is empty — select 'Insert' from the algorithm menu and click Run, or use Random Tree"}
        </span>
        <button className={styles.randomBtn} onClick={buildRandomTree}>
          Random Tree
        </button>
      </div>
    </div>
  );
}
