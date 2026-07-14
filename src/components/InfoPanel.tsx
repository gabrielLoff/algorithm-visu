import { PathfindingAlgorithmStep, PathfindingAlgorithmInfo, GridModel } from '../types';
import { hasGravel, pathCost } from '../grid/gridUtils';
import { COLORS } from '../constants/colors';
import styles from './InfoPanel.module.css';

interface InfoPanelProps {
  step: PathfindingAlgorithmStep | null;
  algorithmInfo: PathfindingAlgorithmInfo | null;
  hasAlgorithm: boolean;
  grid: GridModel;
}

const LEGEND_ITEMS = [
  { color: COLORS.wall, label: 'Wall' },
  { color: COLORS.gravel, label: 'Gravel (2x cost)' },
  { color: COLORS.start, label: 'Start' },
  { color: COLORS.goal, label: 'Goal' },
  { color: COLORS.visited, label: 'Visited' },
  { color: COLORS.frontier, label: 'Frontier' },
  { color: COLORS.current, label: 'Current' },
  { color: COLORS.path, label: 'Path' },
];

function getStatus(
  step: PathfindingAlgorithmStep | null,
  hasAlgorithm: boolean,
  grid: GridModel,
): string {
  if (!hasAlgorithm) return 'Ready';
  if (!step) return 'Ready';
  if (step.done && step.path) {
    const steps = step.path.length - 1;
    const cost = pathCost(step.path, grid);
    return `Path found! (length: ${steps}, cost: ${cost})`;
  }
  if (step.done && !step.path) return 'No path exists';
  return 'Searching...';
}

export function InfoPanel({ step, algorithmInfo, hasAlgorithm, grid }: InfoPanelProps) {
  const status = getStatus(step, hasAlgorithm, grid);
  const visitedCount = step ? step.visited.length : 0;
  const frontierCount = step ? step.frontier.length : 0;
  const pathSteps = step?.path ? step.path.length - 1 : null;
  const pathTotalCost = step?.path ? pathCost(step.path, grid) : null;

  const showsWarning = algorithmInfo && !algorithmInfo.weighted && hasGravel(grid);

  const guaranteed = algorithmInfo ? algorithmInfo.guaranteesShortest(grid) : false;

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.status}>{status}</div>
        {algorithmInfo && <div className={styles.algorithmTag}>{algorithmInfo.name}</div>}
      </div>

      {hasAlgorithm && (
        <div className={styles.stats}>
          <span className={styles.stat}>
            Visited: <strong>{visitedCount}</strong>
          </span>
          <span className={styles.stat}>
            Frontier: <strong>{frontierCount}</strong>
          </span>
          {pathSteps !== null && (
            <span className={styles.stat}>
              Path:{' '}
              <strong>
                {pathSteps} steps (cost: {pathTotalCost})
              </strong>
            </span>
          )}
        </div>
      )}

      {showsWarning && (
        <div className={styles.warning}>This algorithm does not account for terrain costs.</div>
      )}

      {algorithmInfo && (
        <div className={styles.guarantee}>
          Shortest path guaranteed: <strong>{guaranteed ? 'Yes' : 'No'}</strong>
        </div>
      )}

      <div className={styles.legend}>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className={styles.legendItem}>
            <span className={styles.swatch} style={{ backgroundColor: item.color }} />
            <span className={styles.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
