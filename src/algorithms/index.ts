import { AlgorithmInfo } from '../types';
import { astar } from './astar';
import { dijkstra } from './dijkstra';
import { bfs } from './bfs';
import { dfs } from './dfs';

const algorithms: AlgorithmInfo[] = [
  {
    name: 'A*',
    fn: astar,
    description: 'A* Search — uses heuristic to guide search',
    weighted: true,
    guaranteesShortest: true,
  },
  {
    name: 'Dijkstra',
    fn: dijkstra,
    description: "Dijkstra's Algorithm — guaranteed shortest path",
    weighted: true,
    guaranteesShortest: true,
  },
  {
    name: 'BFS',
    fn: bfs,
    description: 'Breadth-First Search — explores level by level',
    weighted: false,
    guaranteesShortest: true,
  },
  {
    name: 'DFS',
    fn: dfs,
    description: 'Depth-First Search — explores deep paths first',
    weighted: false,
    guaranteesShortest: false,
  },
];

export function getAlgorithm(name: string): AlgorithmInfo | undefined {
  return algorithms.find((a) => a.name === name);
}

export function getAlgorithms(): AlgorithmInfo[] {
  return algorithms;
}
