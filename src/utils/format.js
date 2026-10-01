// Global currency and formatting utility for GameVerse (INR - Indian Rupee)
export const CURRENCY = '₹';

export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toFixed(2)}`;
}

export function formatDuration(duration) {
  if (!duration) return '0 hrs';
  return String(duration);
}
