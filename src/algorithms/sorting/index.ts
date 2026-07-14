import { SortingAlgorithmInfo } from '../../types';

const algorithms: SortingAlgorithmInfo[] = [];

export function getSortingAlgorithm(name: string): SortingAlgorithmInfo | undefined {
  return algorithms.find((a) => a.name === name);
}

export function getSortingAlgorithms(): readonly SortingAlgorithmInfo[] {
  return algorithms;
}
