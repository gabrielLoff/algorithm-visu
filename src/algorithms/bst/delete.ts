import { BSTNode, BSTAlgorithmGenerator } from '../../types';
import { cloneTree } from './treeUtils';

export function* deleteOp(tree: BSTNode | null, value: number): BSTAlgorithmGenerator {
  const root = cloneTree(tree);
  yield { tree: root, activeNode: null, previousNode: null, message: `Deleting ${value}`, done: false };

  if (!root) {
    yield { tree: null, activeNode: null, previousNode: null, message: `Tree is empty`, done: false };
    yield { tree: null, activeNode: null, previousNode: null, message: `Done`, done: true };
    return;
  }

  if (root.value === value) {
    if (!root.left && !root.right) {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Removing root leaf node ${value}`, done: false };
      yield { tree: null, activeNode: null, previousNode: null, message: `Tree is now empty`, done: false };
      yield { tree: null, activeNode: null, previousNode: null, message: `Done`, done: true };
      return;
    }
    if (!root.left && root.right) {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Removing root with right child only`, done: false };
      yield { tree: cloneTree(root.right), activeNode: root.right.value, previousNode: null, message: `${root.right.value} is now the root`, done: false };
      yield { tree: cloneTree(root.right), activeNode: null, previousNode: null, message: `Done`, done: true };
      return;
    }
    if (root.left && !root.right) {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Removing root with left child only`, done: false };
      yield { tree: cloneTree(root.left), activeNode: root.left.value, previousNode: null, message: `${root.left.value} is now the root`, done: false };
      yield { tree: cloneTree(root.left), activeNode: null, previousNode: null, message: `Done`, done: true };
      return;
    }
  }

  yield* deleteFromTree(root, value, null);
  yield { tree: cloneTree(root), activeNode: null, previousNode: null, message: `Done`, done: true };
}

function* deleteFromTree(root: BSTNode, value: number, parent: BSTNode | null): BSTAlgorithmGenerator {
  const current = value < root.value ? root.left : value > root.value ? root.right : root;

  if (value < root.value) {
    yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `${value} < ${root.value}, going left`, done: false };
    if (current) yield* deleteFromTree(current, value, root);
    else {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `${value} not found`, done: false };
    }
  } else if (value > root.value) {
    yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `${value} > ${root.value}, going right`, done: false };
    if (current) yield* deleteFromTree(current, value, root);
    else {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `${value} not found`, done: false };
    }
  } else {
    yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Found ${value}`, done: false };

    if (!root.left && !root.right) {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Removing leaf node ${value}`, done: false };
      replaceChild(parent, root, null);
    } else if (!root.left) {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Removing node with right child only`, done: false };
      replaceChild(parent, root, root.right);
    } else if (!root.right) {
      yield { tree: cloneTree(root), activeNode: root.value, previousNode: null, message: `Removing node with left child only`, done: false };
      replaceChild(parent, root, root.left);
    } else {
      let successor = root.right;
      let succParent = root;
      while (successor.left) {
        yield { tree: cloneTree(root), activeNode: successor.value, previousNode: null, message: `Finding successor from ${successor.value}`, done: false };
        succParent = successor;
        successor = successor.left;
      }

      yield { tree: cloneTree(root), activeNode: successor.value, previousNode: root.value, message: `Replacing ${root.value} with successor ${successor.value}`, done: false };
      root.value = successor.value;
      if (succParent === root) {
        succParent.right = successor.right;
      } else {
        succParent.left = successor.right;
      }
    }
  }
}

function replaceChild(parent: BSTNode | null, oldChild: BSTNode, newChild: BSTNode | null): void {
  if (!parent) return;
  if (parent.left === oldChild) parent.left = newChild;
  else if (parent.right === oldChild) parent.right = newChild;
}
