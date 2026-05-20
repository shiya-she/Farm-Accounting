export function formatAmount(value: number | string): string {
  return Number(value).toFixed(2);
}

export function cnAmount(value: number | string): string {
  const abs = Math.abs(Number(value));
  if (abs >= 10000) {
    return (abs / 10000).toFixed(2) + '万';
  }
  return abs.toFixed(2);
}
