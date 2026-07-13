import { useState, useCallback } from 'react';
import { CellPosition, EditMode, GridModel } from '../types';
import {
  createGrid,
  toggleWall,
  setStart,
  setGoal,
  clearWalls,
  resetGrid,
} from '../grid/gridModel';

export function useGrid(rows: number, cols: number) {
  const [grid, setGrid] = useState<GridModel>(() => createGrid(rows, cols));
  const [mode, setMode] = useState<EditMode>('wall');

  const handleCellClick = useCallback(
    (pos: CellPosition) => {
      setGrid((prev) => {
        switch (mode) {
          case 'wall':
            return toggleWall(prev, pos);
          case 'start':
            return setStart(prev, pos);
          case 'goal':
            return setGoal(prev, pos);
          default:
            return prev;
        }
      });
    },
    [mode]
  );

  const handleClearWalls = useCallback(() => {
    setGrid((prev) => clearWalls(prev));
  }, []);

  const handleReset = useCallback(() => {
    setGrid((prev) => resetGrid(prev));
  }, []);

  return {
    grid,
    setGrid,
    mode,
    setMode,
    handleCellClick,
    handleClearWalls,
    handleReset,
  };
}
