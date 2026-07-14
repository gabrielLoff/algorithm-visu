import { SortingAlgorithmGenerator } from '../../types';

export function* bubbleSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      yield { array: [...arr], compared: [j, j + 1], swapped: null, done: false };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { array: [...arr], compared: [j, j + 1], swapped: [j, j + 1], done: false };
      }
    }
  }

  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
