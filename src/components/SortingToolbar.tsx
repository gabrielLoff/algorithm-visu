import { getSortingAlgorithms } from '../algorithms/sorting';
import base from './ToolbarBase.module.css';
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
          {getSortingAlgorithms().map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className={base.section}>
        <label className={base.label}>Size</label>
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

      <div className={base.section}>
        <button className={base.btn} onClick={onRandomize} disabled={isAnimating}>
          Randomize
        </button>
      </div>
    </div>
  );
}
