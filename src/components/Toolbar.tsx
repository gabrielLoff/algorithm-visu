import { EditMode } from '../types';
import { getAlgorithms } from '../algorithms';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (name: string) => void;
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
  onClearWalls: () => void;
  onReset: () => void;
  isAnimating: boolean;
}

export function Toolbar({
  selectedAlgorithm,
  onAlgorithmChange,
  mode,
  onModeChange,
  onClearWalls,
  onReset,
  isAnimating,
}: ToolbarProps) {
  const algorithms = getAlgorithms();

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
