import { PathfindingPage } from '../pages/PathfindingPage';

export interface VisualizerInfo {
  name: string;
  description: string;
  hash: string;
  component: () => JSX.Element;
}

const visualizers: VisualizerInfo[] = [
  {
    name: 'Pathfinding',
    description: 'Watch A*, Dijkstra, BFS, and DFS search a grid to find the shortest path.',
    hash: 'pathfinding',
    component: PathfindingPage,
  },
];

export function getVisualizers(): readonly VisualizerInfo[] {
  return visualizers;
}
