/**
 * Currency Utility Functions
 * 
 * Purpose: Centralized currency formatting utilities for the Indian Rupee (INR).
 * All amounts are stored in paise (smallest unit) and formatted for display.
 * 
 * Features:
 * - Consistent INR formatting across the application
 * - Conversion from paise to rupees
 * - Localized number formatting for Indian locale
 */

/**
 * Formats an amount in paise to a readable INR currency string
 * @param amountInPaise - Amount in paise (1 rupee = 100 paise)
 * @returns Formatted currency string (e.g., "₹1,234.56")
 */
export const formatCurrency = (amountInPaise: number): string => {
  const amountInRupees = amountInPaise / 100;
  return `₹${amountInRupees.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Converts rupees to paise for storage
 * @param amountInRupees - Amount in rupees
 * @returns Amount in paise
 */
export const rupeesToPaise = (amountInRupees: number): number => {
  return Math.round(amountInRupees * 100);
};

/**
 * Converts paise to rupees for calculations
 * @param amountInPaise - Amount in paise
 * @returns Amount in rupees
 */
export const paiseToRupees = (amountInPaise: number): number => {
  return amountInPaise / 100;
}; 