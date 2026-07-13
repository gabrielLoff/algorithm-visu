import { EditMode } from '../types';
import { getAlgorithms } from '../algorithms';
import { getMazes } from '../maze';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (name: string) => void;
  selectedMaze: string;
  onMazeChange: (name: string) => void;
  onGenerateMaze: () => void;
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
  onClearWalls: () => void;
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
  onClearWalls,
  onReset,
  isAnimating,
}: ToolbarProps) {
  const algorithms = getAlgorithms();
  const mazes = getMazes();

  return (
    <div className={styles.toolbar}>
      <div className={styles.section}>
        <label className={styles.label}>Algorithm</label>
        <select
          className={styles.select}
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

      <div className={styles.section}>
        <label className={styles.label}>Maze</label>
        <select
          className={styles.select}
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
        <button
          className={styles.btn}
          onClick={onGenerateMaze}
          disabled={isAnimating}
        >
          Generate
        </button>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Mode</label>
        <div className={styles.modeGroup}>
          {(['wall', 'start', 'goal'] as EditMode[]).map((m) => (
            <button
              key={m}
              className={`${styles.modeBtn} ${mode === m ? styles.active : ''}`}
              onClick={() => onModeChange(m)}
              disabled={isAnimating}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <button
          className={styles.btn}
          onClick={onClearWalls}
          disabled={isAnimating}
        >
          Clear Walls
        </button>
        <button
          className={styles.btn}
          onClick={onReset}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
