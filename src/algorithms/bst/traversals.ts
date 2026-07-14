import { BSTNode, BSTAlgorithmGenerator } from '../../types';
import { cloneTree } from './treeUtils';

export function* inorder(tree: BSTNode | null, _value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Inorder traversal`, done: false };
  yield* inorderHelper(root);
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}

function* inorderHelper(node: BSTNode | null): BSTAlgorithmGenerator {
  if (!node) return;
  yield* inorderHelper(node.left);
  yield { tree: null, activeNode: node.value, previousNode: null, message: `Visit ${node.value}`, done: false };
  yield* inorderHelper(node.right);
}

export function* preorder(tree: BSTNode | null, _value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Preorder traversal`, done: false };
  yield* preorderHelper(root);
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}

function* preorderHelper(node: BSTNode | null): BSTAlgorithmGenerator {
  if (!node) return;
  yield { tree: null, activeNode: node.value, previousNode: null, message: `Visit ${node.value}`, done: false };
  yield* preorderHelper(node.left);
  yield* preorderHelper(node.right);
}

export function* postorder(tree: BSTNode | null, _value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Postorder traversal`, done: false };
  yield* postorderHelper(root);
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}

function* postorderHelper(node: BSTNode | null): BSTAlgorithmGenerator {
  if (!node) return;
  yield* postorderHelper(node.left);
  yield* postorderHelper(node.right);
  yield { tree: null, activeNode: node.value, previousNode: null, message: `Visit ${node.value}`, done: false };
}

export function* levelOrder(tree: BSTNode | null, _value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Level-order traversal`, done: false };

  if (!root) {
    yield { tree: null, activeNode: null, previousNode: null, message: `Done`, done: true };
    return;
  }

  const queue: BSTNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    yield { tree: cloneTree(root), activeNode: node.value, previousNode: null, message: `Visit ${node.value}`, done: false };

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}
