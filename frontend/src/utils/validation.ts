/**
 * ============================================================================
 * 🔍 FRONTEND VALIDATION UTILITIES
 * ============================================================================
 * 
 * This file contains validation functions for form inputs.
 * Provides client-side validation to improve user experience.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password strength according to backend requirements
 * - At least 8 characters long
 * - At least one uppercase letter
 * - At least one lowercase letter  
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates name fields (first name, last name)
 */
export const validateName = (name: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name.trim()) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }
  
  if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates complete registration form
 */
export const validateRegistrationForm = (formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): ValidationResult => {
  const allErrors: string[] = [];
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    allErrors.push(...emailValidation.errors);
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    allErrors.push(...passwordValidation.errors);
  }
  
  // Validate first name
  const firstNameValidation = validateName(formData.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    allErrors.push(...firstNameValidation.errors);
  }
  
  // Validate last name
  const lastNameValidation = validateName(formData.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    allErrors.push(...lastNameValidation.errors);
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Validates login form
 */
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): ValidationResult => {
  const allErrors: string[] = [];
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    allErrors.push(...emailValidation.errors);
  }
  
  // Validate password (basic validation for login)
  if (!formData.password.trim()) {
    allErrors.push('Password is required');
  } else if (formData.password.trim().length < 8) {
    allErrors.push('Password must be at least 8 characters long');
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Helper to check if a specific field has an error
 */
export const hasFieldError = (fieldName: string, value: string, _isSignUp: boolean = false): boolean => {
  if (!value) return false;
  
  switch (fieldName) {
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'password':
      return value.length < 8;
    case 'firstName':
    case 'lastName':
      return value.trim().length < 2;
    default:
      return false;
  }
};
