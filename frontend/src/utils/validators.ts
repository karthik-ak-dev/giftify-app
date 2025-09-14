/**
 * Validation utility functions
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 * @param email Email to validate
 * @returns Validation result
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true };
};

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Validation result
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate Indian phone number
 * @param phoneNumber Phone number to validate
 * @returns Validation result
 */
export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  if (!phoneNumber) {
    return { isValid: true }; // Phone number is optional
  }
  
  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check for Indian mobile number format (10 digits starting with 6-9)
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  if (!indianMobileRegex.test(cleanNumber)) {
    return { isValid: false, error: 'Please enter a valid 10-digit Indian mobile number' };
  }
  
  return { isValid: true };
};

/**
 * Validate name (first name or last name)
 * @param name Name to validate
 * @param fieldName Field name for error message
 * @returns Validation result
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} is too long` };
  }
  
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

/**
 * Validate quantity for cart items
 * @param quantity Quantity to validate
 * @param min Minimum allowed quantity
 * @param max Maximum allowed quantity
 * @returns Validation result
 */
export const validateQuantity = (
  quantity: number,
  min: number = 1,
  max: number = 100
): ValidationResult => {
  if (!Number.isInteger(quantity)) {
    return { isValid: false, error: 'Quantity must be a whole number' };
  }
  
  if (quantity < min) {
    return { isValid: false, error: `Minimum quantity is ${min}` };
  }
  
  if (quantity > max) {
    return { isValid: false, error: `Maximum quantity is ${max}` };
  }
  
  return { isValid: true };
};

/**
 * Validate amount for wallet topup
 * @param amount Amount to validate
 * @returns Validation result
 */
export const validateAmount = (amount: number): ValidationResult => {
  if (!amount || amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount < 100) {
    return { isValid: false, error: 'Minimum amount is ₹1.00' };
  }
  
  if (amount > 10000000) {
    return { isValid: false, error: 'Maximum amount is ₹1,00,000.00' };
  }
  
  return { isValid: true };
};

/**
 * Validate form data against multiple validators
 * @param data Form data object
 * @param validators Object with field validators
 * @returns Object with validation results for each field
 */
export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  validators: Record<keyof T, (value: unknown) => ValidationResult>
): Record<keyof T, ValidationResult> => {
  const results = {} as Record<keyof T, ValidationResult>;
  
  for (const field in validators) {
    results[field] = validators[field](data[field]);
  }
  
  return results;
};

/**
 * Check if form validation results are all valid
 * @param validationResults Validation results object
 * @returns True if all fields are valid
 */
export const isFormValid = (
  validationResults: Record<string, ValidationResult>
): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
}; 