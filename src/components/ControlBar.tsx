import styles from './ControlBar.module.css';
import { RunIcon, StepBackwardIcon, PauseIcon, PlayIcon, StepForwardIcon } from './icons';

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
        <RunIcon />
        Run
      </button>

      <button
        className={styles.btn}
        onClick={onStepBackward}
        disabled={!hasAlgorithm || isPlaying}
        title="Step backward"
      >
        <StepBackwardIcon />
      </button>

      {isPlaying ? (
        <button className={styles.btn} onClick={onPause} title="Pause">
          <PauseIcon />
        </button>
      ) : (
        <button
          className={styles.btn}
          onClick={onPlay}
          disabled={!hasAlgorithm || isDone}
          title="Play"
        >
          <PlayIcon />
        </button>
      )}

      <button
        className={styles.btn}
        onClick={onStepForward}
        disabled={!hasAlgorithm || isPlaying || isDone}
        title="Step forward"
      >
        <StepForwardIcon />
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
