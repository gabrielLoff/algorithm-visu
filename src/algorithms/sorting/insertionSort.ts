import { SortingAlgorithmGenerator } from '../../types';

export function* insertionSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      yield { array: [...arr], compared: [j, i], swapped: null, done: false };

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        yield { array: [...arr], compared: [j, j + 1], swapped: [j, j + 1], done: false };
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
  }

  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
