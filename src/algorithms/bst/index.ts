import { BSTAlgorithmInfo } from '../../types';
import { insertOp } from './insert';
import { deleteOp } from './delete';
import { searchOp, minOp, maxOp } from './search';
import { inorder, preorder, postorder, levelOrder } from './traversals';

const algorithms: BSTAlgorithmInfo[] = [
  { name: 'Insert', fn: insertOp, description: 'Insert a value into the BST' },
  { name: 'Delete', fn: deleteOp, description: 'Delete a value from the BST' },
  { name: 'Search', fn: searchOp, description: 'Search for a value in the BST' },
  { name: 'Min', fn: minOp, description: 'Find the minimum value in the BST' },
  { name: 'Max', fn: maxOp, description: 'Find the maximum value in the BST' },
  { name: 'Inorder', fn: inorder, description: 'Traverse the BST in order (sorted)' },
  { name: 'Preorder', fn: preorder, description: 'Traverse the BST in preorder' },
  { name: 'Postorder', fn: postorder, description: 'Traverse the BST in postorder' },
  { name: 'Level-order', fn: levelOrder, description: 'Traverse the BST level by level' },
];

export function getBSTAlgorithm(name: string): BSTAlgorithmInfo | undefined {
  return algorithms.find((a) => a.name === name);
}

export function getBSTAlgorithms(): readonly BSTAlgorithmInfo[] {
  return algorithms;
}
