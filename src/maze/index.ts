import { GridModel } from '../types';
import { recursiveDivision } from './recursiveDivision';
import { prim } from './prim';

export type MazeGeneratorFn = (grid: GridModel) => GridModel;

export interface MazeInfo {
  name: string;
  fn: MazeGeneratorFn;
}

const mazes: MazeInfo[] = [
  { name: 'Recursive Division', fn: recursiveDivision },
  { name: "Prim's", fn: prim },
];

export function getMaze(name: string): MazeInfo | undefined {
  return mazes.find((m) => m.name === name);
}

export function getMazes(): readonly MazeInfo[] {
  return mazes;
}
