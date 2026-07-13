import { getVisualizers } from '../visualizers';
import type { VisualizerInfo } from '../visualizers';
import styles from './HomePage.module.css';

function Card({ visualizer }: { visualizer: VisualizerInfo }) {
  return (
    <div
      className={styles.card}
      onClick={() => {
        window.location.hash = `#/${visualizer.hash}`;
      }}
    >
      <div className={styles.cardTitle}>{visualizer.name}</div>
      <div className={styles.cardDesc}>{visualizer.description}</div>
    </div>
  );
}

export function HomePage() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Algorithm Visualizer</h1>
      <div className={styles.cards}>
        {getVisualizers().map((v) => (
          <Card key={v.hash} visualizer={v} />
        ))}
      </div>
    </div>
  );
}
