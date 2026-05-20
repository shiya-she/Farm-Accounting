export function formatAmount(value) {
  return Number(value).toFixed(2);
}

export function cnAmount(value) {
  const abs = Math.abs(Number(value));
  if (abs >= 10000) {
    return (abs / 10000).toFixed(2) + '万';
  }
  return abs.toFixed(2);
}
