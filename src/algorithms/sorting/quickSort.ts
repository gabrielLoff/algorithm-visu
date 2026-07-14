import { SortingAlgorithmGenerator } from '../../types';

function* quickSortHelper(arr: number[], low: number, high: number): SortingAlgorithmGenerator {
  if (low >= high) return;

  const pivotIndex = yield* partition(arr, low, high);
  yield* quickSortHelper(arr, low, pivotIndex - 1);
  yield* quickSortHelper(arr, pivotIndex + 1, high);
}

function* partition(arr: number[], low: number, high: number): Generator<{ array: number[]; compared: [number, number]; swapped: [number, number] | null; done: false }, number> {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    yield { array: [...arr], compared: [j, high], swapped: null, done: false };

    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { array: [...arr], compared: [i, j], swapped: [i, j], done: false };
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { array: [...arr], compared: [i + 1, high], swapped: [i + 1, high], done: false };

  return i + 1;
}

export function* quickSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);
  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
