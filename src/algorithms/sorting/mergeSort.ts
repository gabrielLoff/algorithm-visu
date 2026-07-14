import { SortingAlgorithmGenerator } from '../../types';

function* mergeSortHelper(
  arr: number[],
  aux: number[],
  low: number,
  high: number,
): SortingAlgorithmGenerator {
  if (low >= high) return;

  const mid = Math.floor((low + high) / 2);
  yield* mergeSortHelper(arr, aux, low, mid);
  yield* mergeSortHelper(arr, aux, mid + 1, high);
  yield* merge(arr, aux, low, mid, high);
}

function* merge(
  arr: number[],
  aux: number[],
  low: number,
  mid: number,
  high: number,
): SortingAlgorithmGenerator {
  for (let k = low; k <= high; k++) {
    aux[k] = arr[k];
  }

  let i = low;
  let j = mid + 1;

  for (let k = low; k <= high; k++) {
    if (i > mid) {
      yield { array: [...arr], compared: [k, j], swapped: null, done: false };
      arr[k] = aux[j];
      yield { array: [...arr], compared: [k, j], swapped: [k, j], done: false };
      j++;
    } else if (j > high) {
      yield { array: [...arr], compared: [k, i], swapped: null, done: false };
      arr[k] = aux[i];
      yield { array: [...arr], compared: [k, i], swapped: [k, i], done: false };
      i++;
    } else {
      yield { array: [...arr], compared: [i, j], swapped: null, done: false };
      if (aux[i] <= aux[j]) {
        arr[k] = aux[i];
        yield { array: [...arr], compared: [k, i], swapped: [k, i], done: false };
        i++;
      } else {
        arr[k] = aux[j];
        yield { array: [...arr], compared: [k, j], swapped: [k, j], done: false };
        j++;
      }
    }
  }
}

export function* mergeSort(array: number[]): SortingAlgorithmGenerator {
  const arr = [...array];
  const aux = [...array];
  yield* mergeSortHelper(arr, aux, 0, arr.length - 1);
  yield { array: [...arr], compared: [0, 0], swapped: null, done: true };
}
