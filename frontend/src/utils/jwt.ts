// JWT Token Utilities

interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification (client-side)
 * Note: This doesn't verify the signature, only decodes the payload
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return true;
  }

  // Check if token expires in the next 5 minutes (buffer time)
  const expiryTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  return expiryTime - currentTime < bufferTime;
};

/**
 * Get time until token expiry in milliseconds
 */
export const getTimeUntilExpiry = (token: string): number | null => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return null;
  }

  const expiryTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const timeLeft = expiryTime - currentTime;

  return timeLeft > 0 ? timeLeft : 0;
};

/**
 * Validate token type
 */
export const isValidTokenType = (token: string, expectedType: 'access' | 'refresh'): boolean => {
  const decoded = decodeJWT(token);
  return decoded !== null && decoded.type === expectedType;
};

