import styles from './ControlBar.module.css';

interface ControlBarProps {
  isPlaying: boolean;
  isDone: boolean;
  hasAlgorithm: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onRun: () => void;
}

export function ControlBar({
  isPlaying,
  isDone,
  hasAlgorithm,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onRun,
}: ControlBarProps) {
  return (
    <div className={styles.controlBar}>
      <button
        className={styles.btn}
        onClick={onRun}
        disabled={isPlaying}
        title="Run algorithm"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        Run
      </button>

      <button
        className={styles.btn}
        onClick={onStepBackward}
        disabled={!hasAlgorithm || isPlaying}
        title="Step backward"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="19,20 9,12 19,4" />
          <line x1="5" y1="19" x2="5" y2="5" />
        </svg>
      </button>

      {isPlaying ? (
        <button className={styles.btn} onClick={onPause} title="Pause">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        </button>
      ) : (
        <button
          className={styles.btn}
          onClick={onPlay}
          disabled={!hasAlgorithm || isDone}
          title="Play"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="8,5 19,12 8,19" />
          </svg>
        </button>
      )}

      <button
        className={styles.btn}
        onClick={onStepForward}
        disabled={!hasAlgorithm || isPlaying || isDone}
        title="Step forward"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5,4 15,12 5,20" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      </button>

      <div className={styles.speedControl}>
        <label className={styles.label}>Speed: {speed}</label>
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
    </div>
  );
}
