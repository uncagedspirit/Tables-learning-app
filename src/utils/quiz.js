export function generateQuestion(min = 2, max = 10) {
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return { a, b, answer: a * b };
}

export function generateQuestionFromList(mistakes) {
  if (!mistakes || mistakes.length === 0) return null;
  const idx = Math.floor(Math.random() * mistakes.length);
  const { a, b } = mistakes[idx];
  return { a, b, answer: a * b };
}

export function formatAccuracy(correct, total) {
  if (total === 0) return '0%';
  return `${Math.round((correct / total) * 100)}%`;
}
