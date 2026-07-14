import { PathfindingPage } from '../pages/PathfindingPage';
import { SortingPage } from '../pages/SortingPage';
import { BSTPage } from '../pages/BSTPage';

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
  {
    name: 'Binary Search Tree',
    description: 'Visualize BST operations and traversals — insert, delete, search, and more.',
    hash: 'bst',
    component: BSTPage,
  },
];

export function getVisualizers(): readonly VisualizerInfo[] {
  return visualizers;
}

export function navigateHome(): void {
  window.location.hash = '#/';
}
