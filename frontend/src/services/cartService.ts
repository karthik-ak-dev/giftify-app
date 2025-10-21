import { API_CONFIG, getApiUrl } from '../config/api';
import { tokenService } from './authService';
import { Cart, CartResponse, ManageCartRequest, ManageCartResponse } from '../types/cart';

/**
 * Fetch user's cart from backend
 */
export const fetchCart = async (): Promise<Cart> => {
  const accessToken = tokenService.getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CART.GET), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch cart');
  }

  const result: CartResponse = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error('Invalid response from server');
  }

  return result.data;
};

/**
 * Manage cart items (add, update, remove)
 */
export const manageCart = async (data: ManageCartRequest): Promise<ManageCartResponse['data']> => {
  const accessToken = tokenService.getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CART.MANAGE), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to update cart');
  }

  const result: ManageCartResponse = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error('Invalid response from server');
  }

  return result.data;
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
  const accessToken = tokenService.getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CART.CLEAR), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to clear cart');
  }
};

