import { PathfindingAlgorithmInfo, GridModel } from '../types';
import { hasGravel } from '../grid/gridUtils';
import { astar } from './astar';
import { dijkstra } from './dijkstra';
import { bfs } from './bfs';
import { dfs } from './dfs';

const algorithms: PathfindingAlgorithmInfo[] = [
  {
    name: 'A*',
    fn: astar,
    description: 'A* Search — uses heuristic to guide search',
    weighted: true,
    guaranteesShortest: () => true,
  },
  {
    name: 'Dijkstra',
    fn: dijkstra,
    description: "Dijkstra's Algorithm — guaranteed shortest path",
    weighted: true,
    guaranteesShortest: () => true,
  },
  {
    name: 'BFS',
    fn: bfs,
    description: 'Breadth-First Search — explores level by level',
    weighted: false,
    guaranteesShortest: (grid: GridModel) => !hasGravel(grid),
  },
  {
    name: 'DFS',
    fn: dfs,
    description: 'Depth-First Search — explores deep paths first',
    weighted: false,
    guaranteesShortest: () => false,
  },
];

export function getAlgorithm(name: string): PathfindingAlgorithmInfo | undefined {
  return algorithms.find((a) => a.name === name);
}

export function getAlgorithms(): readonly PathfindingAlgorithmInfo[] {
  return algorithms;
}
