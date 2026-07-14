import { BSTNode } from '../../types';

export function cloneTree(node: BSTNode | null): BSTNode | null {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export function createNode(value: number): BSTNode {
  return { value, left: null, right: null };
}

export function countNodes(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

export function insertValue(node: BSTNode, value: number): void {
  if (value < node.value) {
    if (node.left) insertValue(node.left, value);
    else node.left = createNode(value);
  } else if (value > node.value) {
    if (node.right) insertValue(node.right, value);
    else node.right = createNode(value);
  }
}
