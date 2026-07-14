import { EditMode } from '../types';
import { getAlgorithms } from '../algorithms/pathfinding';
import { getMazes } from '../maze';
import base from './ToolbarBase.module.css';
import styles from './Toolbar.module.css';

const EDIT_MODES: { value: EditMode; label: string }[] = [
  { value: 'start', label: 'Start' },
  { value: 'goal', label: 'Goal' },
  { value: 'wall', label: 'Wall' },
  { value: 'gravel', label: 'Gravel' },
  { value: 'default', label: 'Default' },
];

interface ToolbarProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (name: string) => void;
  selectedMaze: string;
  onMazeChange: (name: string) => void;
  onGenerateMaze: () => void;
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
  onClearAll: () => void;
  onReset: () => void;
  isAnimating: boolean;
}

export function Toolbar({
  selectedAlgorithm,
  onAlgorithmChange,
  selectedMaze,
  onMazeChange,
  onGenerateMaze,
  mode,
  onModeChange,
  onClearAll,
  onReset,
  isAnimating,
}: ToolbarProps) {
  const algorithms = getAlgorithms();
  const mazes = getMazes();

  return (
    <div className={base.toolbar}>
      <button
        className={base.btn}
        onClick={() => {
          window.location.hash = '#/';
        }}
      >
        Home
      </button>
      <div className={base.section}>
        <label className={base.label}>Algorithm</label>
        <select
          className={base.select}
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isAnimating}
        >
          {algorithms.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className={base.section}>
        <label className={base.label}>Maze</label>
        <select
          className={base.select}
          value={selectedMaze}
          onChange={(e) => onMazeChange(e.target.value)}
          disabled={isAnimating}
        >
          {mazes.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <button className={base.btn} onClick={onGenerateMaze} disabled={isAnimating}>
          Generate
        </button>
      </div>

      <div className={base.section}>
        <label className={base.label}>Mode</label>
        <div className={styles.modeGroup}>
          {EDIT_MODES.map((m) => (
            <button
              key={m.value}
              className={`${styles.modeBtn} ${mode === m.value ? styles.active : ''}`}
              onClick={() => onModeChange(m.value)}
              disabled={isAnimating}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={base.section}>
        <button className={base.btn} onClick={onClearAll} disabled={isAnimating}>
          Clear All
        </button>
        <button className={base.btn} onClick={onReset} disabled={isAnimating}>
          Reset
        </button>
      </div>
    </div>
  );
}
