/**
 * Formats a given number to two decimal places.
 * - If both decimal places are zero, it returns the number without decimals.
 * - Otherwise, it ensures the number has two decimal places.
 *
 * @param {number} num - The number to format.
 * @returns {string} The formatted number with two decimals or no decimals if not needed.
 *
 * @example
 * formatNumber(12.345); // "12.35"
 * formatNumber(12.00);  // "12"
 * formatNumber(12.1);   // "12.10"
 */
export const formatNumber = (num: number): string => {
  const rounded = Math.round(num * 100) / 100
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2)
}
