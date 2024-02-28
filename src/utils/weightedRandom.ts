export const weightedRandom = (weights: number[]): number => {
  if (!weights.length) {
    throw new TypeError('Items must not be empty')
  }

  const cumulativeWeights: number[] = []

  for (let i = 0; i < weights.length; i += 1) {
    const prev = cumulativeWeights[i - 1] ?? 0;
    const curr = weights[i] ?? 0;
    cumulativeWeights[i] = curr + prev;
  }

  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];

  if (maxCumulativeWeight === undefined) {
    // This check is just to satisfy TypeScript, it should logically never be true
    throw new Error('maxCumulativeWeight is undefined, impossible state reached');
  }

  const randomNumber = maxCumulativeWeight * Math.random();

  for (let i = 0; i < weights.length; i += 1) {
    const weight = cumulativeWeights[i];
    if (weight !== undefined && weight >= randomNumber) {
      return i;
    }
  }

  // If the code ran this far, something is very wrong. This should never happen.
  throw new RangeError('weightedRandom: impossible state reached');
}

