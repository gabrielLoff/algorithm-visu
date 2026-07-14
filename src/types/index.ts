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

export type PathfindingAlgorithmStep = {
  frontier: CellPosition[];
  visited: CellPosition[];
  current: CellPosition | null;
  path: CellPosition[] | null;
  done: boolean;
};

export type PathfindingAlgorithmGenerator = Generator<PathfindingAlgorithmStep, void, undefined>;

export type PathfindingAlgorithmFn = (grid: GridModel) => PathfindingAlgorithmGenerator;

export interface PathfindingAlgorithmInfo {
  name: string;
  fn: PathfindingAlgorithmFn;
  description: string;
  weighted: boolean;
  /** Whether this algorithm guarantees a shortest path for the given grid.
   *  Most algorithms return a constant (A*, Dijkstra: true; DFS: false).
   *  Only BFS inspects the grid — it guarantees shortest when there is no gravel. */
  guaranteesShortest: (grid: GridModel) => boolean;
}

export type EditMode = 'wall' | 'start' | 'goal' | 'gravel' | 'default';
