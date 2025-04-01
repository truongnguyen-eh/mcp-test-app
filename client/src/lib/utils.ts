import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSimilarity(array1: Array<string>, array2: Array<string>): number {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const intersection = new Set([...set1].filter(item => set2.has(item)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}
