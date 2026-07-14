import { getBSTAlgorithms } from '../algorithms/bst';
import base from './ToolbarBase.module.css';
import styles from './BSTToolbar.module.css';

interface BSTToolbarProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (name: string) => void;
  value: number;
  onValueChange: (value: number) => void;
  onRun: () => void;
  onClear: () => void;
  isAnimating: boolean;
  message: string;
}

export function BSTToolbar({
  selectedAlgorithm,
  onAlgorithmChange,
  value,
  onValueChange,
  onRun,
  onClear,
  isAnimating,
  message,
}: BSTToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={base.section}>
        <label className={base.label}>Algorithm</label>
        <select
          className={base.select}
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isAnimating}
        >
          {getBSTAlgorithms().map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className={base.section}>
        <label className={base.label}>Value</label>
        <input
          type="number"
          className={styles.input}
          value={value}
          disabled={isAnimating}
          onChange={(e) => onValueChange(Number(e.target.value))}
        />
      </div>

      <div className={base.section}>
        <button className={base.btn} onClick={onRun} disabled={isAnimating}>
          Run
        </button>
        <button className={base.btn} onClick={onClear} disabled={isAnimating}>
          Clear Tree
        </button>
      </div>

      <div className={styles.message}>{message}</div>
    </div>
  );
}
