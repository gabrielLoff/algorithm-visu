import { getSortingAlgorithms } from '../algorithms/sorting';
import styles from './SortingToolbar.module.css';

interface SortingToolbarProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (name: string) => void;
  size: number;
  onSizeChange: (size: number) => void;
  onRandomize: () => void;
  isAnimating: boolean;
}

export function SortingToolbar({
  selectedAlgorithm,
  onAlgorithmChange,
  size,
  onSizeChange,
  onRandomize,
  isAnimating,
}: SortingToolbarProps) {
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
          {getSortingAlgorithms().map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Size</label>
        <input
          type="range"
          min="10"
          max="200"
          value={size}
          className={styles.slider}
          disabled={isAnimating}
          onChange={(e) => onSizeChange(Number(e.target.value))}
        />
        <span className={styles.sizeLabel}>{size}</span>
      </div>

      <div className={styles.section}>
        <button
          className={styles.btn}
          onClick={onRandomize}
          disabled={isAnimating}
        >
          Randomize
        </button>
      </div>
    </div>
  );
}
