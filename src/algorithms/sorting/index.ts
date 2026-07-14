import { SortingAlgorithmInfo } from '../../types';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { radixSort } from './radixSort';

const algorithms: SortingAlgorithmInfo[] = [
  {
    name: 'Bubble Sort',
    fn: bubbleSort,
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order',
  },
  {
    name: 'Selection Sort',
    fn: selectionSort,
    description: 'Finds the minimum element and places it at the beginning',
  },
  {
    name: 'Insertion Sort',
    fn: insertionSort,
    description: 'Builds the sorted array one element at a time',
  },
  {
    name: 'Merge Sort',
    fn: mergeSort,
    description: 'Divides the array, sorts each half, then merges them',
  },
  {
    name: 'Quick Sort',
    fn: quickSort,
    description: 'Partitions around a pivot, then recursively sorts sub-arrays',
  },
  {
    name: 'Heap Sort',
    fn: heapSort,
    description: 'Builds a max heap and repeatedly extracts the maximum',
  },
  {
    name: 'Shell Sort',
    fn: shellSort,
    description: 'Generalization of insertion sort with gap-based comparisons',
  },
  {
    name: 'Radix Sort',
    fn: radixSort,
    description: 'Sorts by processing individual digits from least to most significant',
  },
];

export function getSortingAlgorithm(name: string): SortingAlgorithmInfo | undefined {
  return algorithms.find((a) => a.name === name);
}

export function getSortingAlgorithms(): readonly SortingAlgorithmInfo[] {
  return algorithms;
}
