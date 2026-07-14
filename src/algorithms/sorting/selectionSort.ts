import { SortingAlgorithmGenerator } from '../../types';

export function* selectionSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: [...arr], compared: [minIdx, j], swapped: null, done: false };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { array: [...arr], compared: [i, minIdx], swapped: [i, minIdx], done: false };
    }
  }

  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
