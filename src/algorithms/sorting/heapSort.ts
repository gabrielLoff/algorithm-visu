import { SortingAlgorithmGenerator } from '../../types';

function* heapify(arr: number[], n: number, i: number): SortingAlgorithmGenerator {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    yield { array: [...arr], compared: [largest, left], swapped: null, done: false };
    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  if (right < n) {
    yield { array: [...arr], compared: [largest, right], swapped: null, done: false };
    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { array: [...arr], compared: [i, largest], swapped: [i, largest], done: false };
    yield* heapify(arr, n, largest);
  }
}

export function* heapSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { array: [...arr], compared: [0, i], swapped: [0, i], done: false };
    yield* heapify(arr, i, 0);
  }

  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
