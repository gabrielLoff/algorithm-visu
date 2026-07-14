import { describe, it, expect } from 'vitest';
import { getBSTAlgorithm } from './bst';
import { createNode } from './bst/treeUtils';
import type { BSTAlgorithmFn, BSTAlgorithmStep, BSTNode } from '../types';

function runAlgorithm(fn: BSTAlgorithmFn, tree: BSTNode | null, value: number): BSTAlgorithmStep[] {
  const steps: BSTAlgorithmStep[] = [];
  const gen = fn(tree, value);
  for (const step of gen) {
    steps.push(step);
  }
  return steps;
}

function isBST(node: BSTNode | null, min = -Infinity, max = Infinity): boolean {
  if (!node) return true;
  if (node.value <= min || node.value >= max) return false;
  return isBST(node.left, min, node.value) && isBST(node.right, node.value, max);
}

function countNodes(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function makeTestTree(): BSTNode {
  const root = createNode(50);
  root.left = createNode(30);
  root.right = createNode(70);
  root.left.left = createNode(20);
  root.left.right = createNode(40);
  root.right.left = createNode(60);
  root.right.right = createNode(80);
  return root;
}

describe('Insert', () => {
  it('inserts into an empty tree', () => {
    const steps = runAlgorithm(getBSTAlgorithm('Insert')!.fn, null, 50);
    const last = steps[steps.length - 1];
    expect(last.done).toBe(true);
    expect(last.tree).not.toBeNull();
    expect(last.tree!.value).toBe(50);
    expect(isBST(last.tree)).toBe(true);
  });

  it('inserts smaller value to the left', () => {
    const root = createNode(50);
    const steps = runAlgorithm(getBSTAlgorithm('Insert')!.fn, root, 30);
    const last = steps[steps.length - 1];
    expect(last.tree!.left!.value).toBe(30);
    expect(isBST(last.tree)).toBe(true);
  });

  it('inserts larger value to the right', () => {
    const root = createNode(50);
    const steps = runAlgorithm(getBSTAlgorithm('Insert')!.fn, root, 70);
    const last = steps[steps.length - 1];
    expect(last.tree!.right!.value).toBe(70);
    expect(isBST(last.tree)).toBe(true);
  });

  it('does not insert duplicate values', () => {
    const root = createNode(50);
    const steps = runAlgorithm(getBSTAlgorithm('Insert')!.fn, root, 50);
    const last = steps[steps.length - 1];
    expect(countNodes(last.tree)).toBe(1);
  });
});

describe('Delete', () => {
  it('deletes a leaf node', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Delete')!.fn, tree, 20);
    const last = steps[steps.length - 1];
    expect(last.done).toBe(true);
    expect(last.tree!.left!.left).toBeNull();
    expect(isBST(last.tree)).toBe(true);
  });

  it('deletes a node with one child', () => {
    const root = createNode(50);
    root.left = createNode(30);
    root.left.right = createNode(40);
    const steps = runAlgorithm(getBSTAlgorithm('Delete')!.fn, root, 30);
    const last = steps[steps.length - 1];
    expect(last.tree!.left!.value).toBe(40);
    expect(isBST(last.tree)).toBe(true);
  });

  it('deletes a node with two children', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Delete')!.fn, tree, 50);
    const last = steps[steps.length - 1];
    expect(last.done).toBe(true);
    expect(last.tree!.value).not.toBe(50);
    expect(isBST(last.tree)).toBe(true);
  });
});

describe('Search', () => {
  it('finds an existing value', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Search')!.fn, tree, 40);
    const foundStep = steps.find((s) => s.message.startsWith('Found'));
    expect(foundStep).toBeDefined();
  });

  it('does not find a missing value', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Search')!.fn, tree, 99);
    const notFoundStep = steps.find((s) => s.message.includes('not found'));
    expect(notFoundStep).toBeDefined();
  });
});

describe('Min and Max', () => {
  it('finds the minimum', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Min')!.fn, tree, 0);
    const minStep = steps.find((s) => s.message.startsWith('Minimum'));
    expect(minStep).toBeDefined();
    expect(minStep!.message).toContain('20');
  });

  it('finds the maximum', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Max')!.fn, tree, 0);
    const maxStep = steps.find((s) => s.message.startsWith('Maximum'));
    expect(maxStep).toBeDefined();
    expect(maxStep!.message).toContain('80');
  });
});

describe('Traversals', () => {
  it('inorder produces sorted values', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Inorder')!.fn, tree, 0);
    const messages = steps.filter((s) => s.message.startsWith('Visit'));
    const values = messages.map((s) => s.activeNode);
    expect(values).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });

  it('preorder visits root first', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Preorder')!.fn, tree, 0);
    const messages = steps.filter((s) => s.message.startsWith('Visit'));
    expect(messages[0].activeNode).toBe(50);
  });

  it('postorder visits root last', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Postorder')!.fn, tree, 0);
    const messages = steps.filter((s) => s.message.startsWith('Visit'));
    expect(messages[messages.length - 1].activeNode).toBe(50);
  });

  it('level-order visits by level', () => {
    const tree = makeTestTree();
    const steps = runAlgorithm(getBSTAlgorithm('Level-order')!.fn, tree, 0);
    const messages = steps.filter((s) => s.message.startsWith('Visit'));
    const values = messages.map((s) => s.activeNode);
    expect(values[0]).toBe(50);
    expect(values[1]).toBe(30);
    expect(values[2]).toBe(70);
  });
});
