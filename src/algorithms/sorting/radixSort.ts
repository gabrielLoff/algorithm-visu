import { SortingAlgorithmGenerator } from '../../types';

function getMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

function* countingSortForRadix(arr: number[], exp: number): SortingAlgorithmGenerator {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    const pos = count[digit] - 1;
    yield { array: [...arr], compared: [i, pos], swapped: null, done: false };
    output[pos] = arr[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    yield { array: [...arr], compared: [i, i], swapped: [i, i], done: false };
  }
}

export function* radixSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const max = getMax(arr);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* countingSortForRadix(arr, exp);
  }

  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
