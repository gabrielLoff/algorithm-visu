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
