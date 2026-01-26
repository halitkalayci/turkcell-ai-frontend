/**
 * Text and Number Formatting Utilities
 * 
 * Reusable formatting functions for UI presentation.
 * These utilities are framework-agnostic and easily testable.
 */

/**
 * Truncate text with ellipsis
 * 
 * @param text - The text to truncate (nullable)
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis or original text
 * 
 * @example
 * truncateText('Hello World', 5) // 'Hello...'
 * truncateText(null, 10) // ''
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Format price with currency symbol
 * 
 * @param price - The numeric price value
 * @param currency - Currency code (e.g., 'USD', 'EUR', 'TRY')
 * @returns Formatted price string
 * 
 * @example
 * formatPrice(99.99, 'USD') // '99.99 USD'
 * formatPrice(1234.5, 'TRY') // '1234.50 TRY'
 */
export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(2)} ${currency}`;
}

/**
 * Format date to locale string
 * 
 * @param date - Date string or Date object
 * @returns Localized date string
 * 
 * @example
 * formatDate('2024-01-15') // '1/15/2024' (US locale)
 * formatDate(new Date()) // Current date formatted
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}
