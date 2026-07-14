import { describe, it, expect } from 'vitest';
import { getSortingAlgorithm } from './sorting';
import type { SortingAlgorithmFn, SortingAlgorithmStep } from '../types';

function runAlgorithm(fn: SortingAlgorithmFn, array: number[]): SortingAlgorithmStep[] {
  const steps: SortingAlgorithmStep[] = [];
  const gen = fn([...array]);
  for (const step of gen) {
    steps.push(step);
  }
  return steps;
}

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function arraysHaveSameElements(a: number[], b: number[]): boolean {
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.length === sortedB.length && sortedA.every((v, i) => v === sortedB[i]);
}

function testSortingAlgorithm(name: string) {
  const algo = getSortingAlgorithm(name);
  if (!algo) return;

  describe(name, () => {
    it('sorts an unsorted array', () => {
      const input = [64, 34, 25, 12, 22, 11, 90];
      const steps = runAlgorithm(algo.fn, input);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(isSorted(last.array)).toBe(true);
      expect(last.array.length).toBe(input.length);
      expect(arraysHaveSameElements(last.array, input)).toBe(true);
    });

    it('handles an empty array', () => {
      const steps = runAlgorithm(algo.fn, []);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(last.array).toEqual([]);
    });

    it('handles a single element', () => {
      const steps = runAlgorithm(algo.fn, [5]);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(last.array).toEqual([5]);
    });

    it('handles an already sorted array', () => {
      const input = [1, 2, 3, 4, 5];
      const steps = runAlgorithm(algo.fn, input);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(isSorted(last.array)).toBe(true);
      expect(arraysHaveSameElements(last.array, input)).toBe(true);
    });

    it('handles a reverse-sorted array', () => {
      const input = [9, 8, 7, 6, 5, 4, 3, 2, 1];
      const steps = runAlgorithm(algo.fn, input);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(isSorted(last.array)).toBe(true);
      expect(arraysHaveSameElements(last.array, input)).toBe(true);
    });

    it('handles duplicate values', () => {
      const input = [4, 2, 4, 1, 2, 3];
      const steps = runAlgorithm(algo.fn, input);
      const last = steps[steps.length - 1];

      expect(last.done).toBe(true);
      expect(isSorted(last.array)).toBe(true);
      expect(last.array.length).toBe(input.length);
    });

    it('yields at least one step', () => {
      const steps = runAlgorithm(algo.fn, [3, 1, 2]);
      expect(steps.length).toBeGreaterThan(0);
    });
  });
}

testSortingAlgorithm('Bubble Sort');
testSortingAlgorithm('Selection Sort');
testSortingAlgorithm('Insertion Sort');
testSortingAlgorithm('Merge Sort');
testSortingAlgorithm('Quick Sort');
testSortingAlgorithm('Heap Sort');
testSortingAlgorithm('Shell Sort');
testSortingAlgorithm('Radix Sort');
