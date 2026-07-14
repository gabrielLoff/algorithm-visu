import { useState, useCallback } from 'react';
import { CellPosition, EditMode, GridModel } from '../types';
import {
  createGrid,
  setWall,
  setGravel,
  setDefault,
  setStart,
  setGoal,
  clearAll,
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
            return setWall(prev, pos);
          case 'gravel':
            return setGravel(prev, pos);
          case 'default':
            return setDefault(prev, pos);
          case 'start':
            return setStart(prev, pos);
          case 'goal':
            return setGoal(prev, pos);
          default:
            return prev;
        }
      });
    },
    [mode],
  );

  const handleClearAll = useCallback(() => {
    setGrid((prev) => clearAll(prev));
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
    handleClearAll,
    handleReset,
  };
}
