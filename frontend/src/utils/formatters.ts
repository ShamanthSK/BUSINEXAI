/**
 * Dynamic Compact Currency Formatter for Chart Axes and Labels
 * Dynamically adjusts formatting scale:
 * - >= ₹1 Crore (10,000,000) -> ₹1.5Cr
 * - >= ₹1 Lakh (100,000)      -> ₹2.5L
 * - >= ₹1 Thousand (1,000)   -> ₹1.8k
 * - < ₹1 Thousand            -> ₹857
 */
export const formatCompactCurrency = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  const absVal = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absVal >= 1e7) {
    const formatted = (absVal / 1e7).toFixed(1).replace(/\.0$/, '');
    return `${sign}₹${formatted}Cr`;
  }
  if (absVal >= 1e5) {
    const formatted = (absVal / 1e5).toFixed(1).replace(/\.0$/, '');
    return `${sign}₹${formatted}L`;
  }
  if (absVal >= 1e3) {
    const formatted = (absVal / 1e3).toFixed(1).replace(/\.0$/, '');
    return `${sign}₹${formatted}k`;
  }
  return `${sign}₹${Math.round(absVal).toLocaleString('en-IN')}`;
};

export const formatFullCurrency = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  return `₹${Number(value).toLocaleString('en-IN')}`;
};
