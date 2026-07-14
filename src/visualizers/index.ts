import { PathfindingPage } from '../pages/PathfindingPage';
import { SortingPage } from '../pages/SortingPage';

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
  {
    name: 'Sorting',
    description: 'Watch Bubble, Quick, Merge, and more sort an array step by step.',
    hash: 'sorting',
    component: SortingPage,
  },
];

export function getVisualizers(): readonly VisualizerInfo[] {
  return visualizers;
}
