import { BSTAlgorithmInfo } from '../../types';

const algorithms: BSTAlgorithmInfo[] = [];

export function getBSTAlgorithm(name: string): BSTAlgorithmInfo | undefined {
  return algorithms.find((a) => a.name === name);
}

export function getBSTAlgorithms(): readonly BSTAlgorithmInfo[] {
  return algorithms;
}
