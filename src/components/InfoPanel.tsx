import { AlgorithmStep, AlgorithmInfo } from '../types';
import { COLORS } from '../constants/colors';
import styles from './InfoPanel.module.css';

interface InfoPanelProps {
  step: AlgorithmStep | null;
  algorithmInfo: AlgorithmInfo | null;
  hasAlgorithm: boolean;
}

const LEGEND_ITEMS = [
  { color: COLORS.start, label: 'Start' },
  { color: COLORS.goal, label: 'Goal' },
  { color: COLORS.wall, label: 'Wall' },
  { color: COLORS.visited, label: 'Visited' },
  { color: COLORS.frontier, label: 'Frontier' },
  { color: COLORS.current, label: 'Current' },
  { color: COLORS.path, label: 'Path' },
];

function getStatus(step: AlgorithmStep | null, hasAlgorithm: boolean): string {
  if (!hasAlgorithm) return 'Ready';
  if (!step) return 'Ready';
  if (step.done && step.path) return `Path found! (length: ${step.path.length - 1})`;
  if (step.done && !step.path) return 'No path exists';
  return 'Searching...';
}

export function InfoPanel({ step, algorithmInfo, hasAlgorithm }: InfoPanelProps) {
  const status = getStatus(step, hasAlgorithm);
  const visitedCount = step ? step.visited.length : 0;
  const frontierCount = step ? step.frontier.length : 0;
  const pathLength = step?.path ? step.path.length - 1 : null;

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.status}>{status}</div>
        {algorithmInfo && (
          <div className={styles.algorithmTag}>{algorithmInfo.name}</div>
        )}
      </div>

      <div className={styles.stats}>
        {hasAlgorithm && (
          <>
            <span className={styles.stat}>
              Visited: <strong>{visitedCount}</strong>
            </span>
            <span className={styles.stat}>
              Frontier: <strong>{frontierCount}</strong>
            </span>
            {pathLength !== null && (
              <span className={styles.stat}>
                Path: <strong>{pathLength}</strong>
              </span>
            )}
          </>
        )}
      </div>

      <div className={styles.legend}>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className={styles.legendItem}>
            <span
              className={styles.swatch}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
