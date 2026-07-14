import { useState, useCallback } from 'react';
import { BSTToolbar } from '../components/BSTToolbar';
import { BSTCanvas } from '../components/BSTCanvas';
import { ControlBar } from '../components/ControlBar';
import { useBSTAnimation } from '../hooks/useBSTAnimation';
import { getBSTAlgorithm, getBSTAlgorithms } from '../algorithms/bst';
import { createNode } from '../algorithms/bst/treeUtils';
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

  const goHome = () => {
    window.location.hash = '#/';
  };

  const lastStep = animation.currentStep;

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
      <div style={{ padding: '8px 16px', display: 'flex', gap: 16, alignItems: 'center', borderTop: '1px solid #374151' }}>
        <button
          onClick={goHome}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #374151',
            background: '#111827',
            color: '#e5e7eb',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Home
        </button>
        <span style={{ color: '#9ca3af', fontSize: 13 }}>
          {tree ? `Tree has ${countNodes(tree)} nodes` : 'Tree is empty — click Insert or use Randomize'}
        </span>
        <button
          onClick={() => {
            let t: BSTNode | null = createNode(Math.floor(Math.random() * 100));
            for (let i = 0; i < 7; i++) {
              const v = Math.floor(Math.random() * 100);
              insertValue(t!, v);
            }
            setTree(t);
          }}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #374151',
            background: '#111827',
            color: '#e5e7eb',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Random Tree
        </button>
      </div>
    </div>
  );
}

function countNodes(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function insertValue(node: BSTNode, value: number): void {
  if (value < node.value) {
    if (node.left) insertValue(node.left, value);
    else node.left = createNode(value);
  } else if (value > node.value) {
    if (node.right) insertValue(node.right, value);
    else node.right = createNode(value);
  }
}
