export function createScoreSummary(scores = []) {
  const safeScores = scores.filter((score) => Number.isFinite(score));

  if (safeScores.length === 0) {
    return {
      max: 0,
      min: 0,
      average: '0.00',
    };
  }

  const total = safeScores.reduce((sum, score) => sum + score, 0);
  const average = total / safeScores.length;

  return {
    max: Math.max(...safeScores),
    min: Math.min(...safeScores),
    average: average.toFixed(2),
  };
}
