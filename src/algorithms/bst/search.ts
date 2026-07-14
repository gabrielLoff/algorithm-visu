import { BSTNode, BSTAlgorithmGenerator } from '../../types';
import { cloneTree } from './treeUtils';

export function* searchOp(tree: BSTNode | null, value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Searching for ${value}`, done: false };

  let current: BSTNode | null = root;
  while (current) {
    yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Comparing ${value} with ${current.value}`, done: false };

    if (value === current.value) {
      yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Found ${value}!`, done: false };
      yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
      return;
    }

    if (value < current.value) {
      yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `${value} < ${current.value}, going left`, done: false };
      current = current.left;
    } else {
      yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `${value} > ${current.value}, going right`, done: false };
      current = current.right;
    }
  }

  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `${value} not found`, done: false };
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}

export function* minOp(tree: BSTNode | null, _value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Finding minimum`, done: false };

  if (!root) {
    yield { tree: null, activeNode: null, previousNode: null, message: `Tree is empty`, done: false };
    yield { tree: null, activeNode: null, previousNode: null, message: `Done`, done: true };
    return;
  }

  let current: BSTNode = root;
  while (current.left) {
    yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Moving left from ${current.value}`, done: false };
    current = current.left;
  }

  yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Minimum is ${current.value}`, done: false };
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}

export function* maxOp(tree: BSTNode | null, _value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Finding maximum`, done: false };

  if (!root) {
    yield { tree: null, activeNode: null, previousNode: null, message: `Tree is empty`, done: false };
    yield { tree: null, activeNode: null, previousNode: null, message: `Done`, done: true };
    return;
  }

  let current: BSTNode = root;
  while (current.right) {
    yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Moving right from ${current.value}`, done: false };
    current = current.right;
  }

  yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Maximum is ${current.value}`, done: false };
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}
