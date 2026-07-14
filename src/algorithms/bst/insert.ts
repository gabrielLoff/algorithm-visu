import { BSTNode, BSTAlgorithmGenerator } from '../../types';
import { cloneTree, createNode } from './treeUtils';

export function* insertOp(tree: BSTNode | null, value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Inserting ${value}`, done: false };

  if (!root) {
    const node = createNode(value);
    yield { tree: node, activeNode: value, previousNode: null, message: `Inserted ${value} as root`, done: false };
    yield { tree: node, activeNode: null, previousNode: null, message: `Done`, done: true };
    return;
  }

  let current: BSTNode = root;
  while (true) {
    yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `Comparing ${value} with ${current.value}`, done: false };

    if (value < current.value) {
      if (!current.left) {
        current.left = createNode(value);
        yield { tree: cloneTree(root), activeNode: value, previousNode: current.value, message: `Inserted ${value} left of ${current.value}`, done: false };
        break;
      }
      current = current.left;
    } else if (value > current.value) {
      if (!current.right) {
        current.right = createNode(value);
        yield { tree: cloneTree(root), activeNode: value, previousNode: current.value, message: `Inserted ${value} right of ${current.value}`, done: false };
        break;
      }
      current = current.right;
    } else {
      yield { tree: cloneTree(root), activeNode: current.value, previousNode: null, message: `${value} already exists`, done: false };
      break;
    }
  }

  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}
