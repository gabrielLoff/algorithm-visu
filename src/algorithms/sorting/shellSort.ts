import { SortingAlgorithmGenerator } from '../../types';

export function* shellSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j: number;

      for (j = i; j >= gap; j -= gap) {
        yield { array: [...arr], compared: [j - gap, j], swapped: null, done: false };

        if (arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          yield { array: [...arr], compared: [j - gap, j], swapped: [j - gap, j], done: false };
        } else {
          break;
        }
      }
      arr[j] = temp;
    }
  }

  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
