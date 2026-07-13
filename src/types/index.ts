export type CellType = 'default' | 'wall' | 'start' | 'goal' | 'gravel';

export interface CellPosition {
  row: number;
  col: number;
}

export interface GridModel {
  rows: number;
  cols: number;
  cells: CellType[][];
  start: CellPosition | null;
  goal: CellPosition | null;
}

export type AlgorithmStep = {
  frontier: CellPosition[];
  visited: CellPosition[];
  current: CellPosition | null;
  path: CellPosition[] | null;
  done: boolean;
};

export type AlgorithmGenerator = Generator<AlgorithmStep, void, undefined>;

export type AlgorithmFn = (grid: GridModel) => AlgorithmGenerator;

export interface AlgorithmInfo {
  name: string;
  fn: AlgorithmFn;
  description: string;
  weighted: boolean;
  guaranteesShortest: (grid: GridModel) => boolean;
}

export type EditMode = 'wall' | 'start' | 'goal' | 'gravel' | 'default';
