/**
 * API Utilities Template
 *
 * Provides utilities for making API calls to the backend.
 * Automatically reads backend URL from app.json configuration.
 *
 * Features:
 * - Automatic backend URL configuration
 * - Error handling with proper logging
 * - Type-safe request/response handling
 * - Helper functions for common HTTP methods
 * - Automatic bearer token management for authenticated requests
 *
 * Usage:
 * 1. Import BACKEND_URL or helper functions
 * 2. Use apiCall() for basic requests
 * 3. Use apiGet(), apiPost(), etc. for convenience
 * 4. Use authenticatedApiCall() for requests requiring auth (token auto-retrieved)
 * 5. Backend URL is automatically configured in app.json when backend deploys
 */

import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Backend URL is configured in app.json under expo.extra.backendUrl
 * It is set automatically when the backend is deployed
 */
export const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || "";

/**
 * Bearer token storage key
 * Must match the key used in lib/auth.ts
 */
const BEARER_TOKEN_KEY = "intentional_dating_bearer_token";

/**
 * Check if backend is properly configured
 */
export const isBackendConfigured = (): boolean => {
  return !!BACKEND_URL && BACKEND_URL.length > 0;
};

/**
 * Get bearer token from platform-specific storage
 * Web: localStorage
 * Native: SecureStore
 *
 * @returns Bearer token or null if not found
 */
export const getBearerToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(BEARER_TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(BEARER_TOKEN_KEY);
    }
  } catch (error) {
    console.error("[API] Error retrieving bearer token:", error);
    return null;
  }
};

/**
 * Generic API call helper with error handling
 *
 * @param endpoint - API endpoint path (e.g., '/users', '/auth/login')
 * @param options - Fetch options (method, headers, body, etc.)
 * @param retries - Number of retry attempts (default: 0)
 * @returns Parsed JSON response
 * @throws Error if backend is not configured or request fails
 */
export const apiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit,
  retries: number = 0
): Promise<T> => {
  if (!isBackendConfigured()) {
    throw new Error("Backend URL not configured. Please rebuild the app.");
  }

  const url = `${BACKEND_URL}${endpoint}`;
  console.log("[API] Calling:", url, options?.method || "GET");

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[API] Error response:", response.status, text);
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("[API] Success:", data);
    return data;
  } catch (error: any) {
    // Retry on network errors if retries are available
    if (retries > 0 && (error.message?.includes('Network') || error.message?.includes('fetch'))) {
      console.log(`[API] Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return apiCall<T>(endpoint, options, retries - 1);
    }
    
    // Enhance error message for common issues
    if (error.message?.includes('Network request failed')) {
      console.error("[API] Network error - check your internet connection");
      throw new Error('Network error - please check your internet connection');
    } else if (error.message?.includes('Failed to fetch')) {
      console.error("[API] Failed to reach backend - backend may be down");
      throw new Error('Unable to reach server - please try again later');
    }
    
    console.error("[API] Request failed:", error);
    throw error;
  }
};

/**
 * GET request helper
 */
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  return apiCall<T>(endpoint, { method: "GET" });
};

/**
 * POST request helper
 */
export const apiPost = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  return apiCall<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT request helper
 */
export const apiPut = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  return apiCall<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * PATCH request helper
 */
export const apiPatch = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  return apiCall<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request helper
 */
export const apiDelete = async <T = any>(endpoint: string): Promise<T> => {
  return apiCall<T>(endpoint, { method: "DELETE" });
};

/**
 * Authenticated API call helper
 * Automatically retrieves bearer token from storage and adds to Authorization header
 *
 * @param endpoint - API endpoint path
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Parsed JSON response
 * @throws Error if token not found or request fails
 */
export const authenticatedApiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token = await getBearerToken();

  if (!token) {
    throw new Error("Authentication token not found. Please sign in.");
  }

  return apiCall<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Authenticated GET request
 */
export const authenticatedGet = async <T = any>(endpoint: string): Promise<T> => {
  return authenticatedApiCall<T>(endpoint, { method: "GET" });
};

/**
 * Authenticated POST request
 */
export const authenticatedPost = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  return authenticatedApiCall<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Authenticated PUT request
 */
export const authenticatedPut = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  return authenticatedApiCall<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Authenticated PATCH request
 */
export const authenticatedPatch = async <T = any>(
  endpoint: string,
  data: any
): Promise<T> => {
  return authenticatedApiCall<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * Authenticated DELETE request
 */
export const authenticatedDelete = async <T = any>(endpoint: string): Promise<T> => {
  return authenticatedApiCall<T>(endpoint, { method: "DELETE" });
};

/**
 * Check if user profile is complete
 * Returns true if profile exists and has required fields
 */
export const checkProfileComplete = async (): Promise<boolean> => {
  try {
    const profile = await authenticatedGet<any>('/api/profile/me');
    // Check if profile has required fields (age, location, photos)
    return !!(profile && profile.age && profile.location && profile.photos?.length > 0);
  } catch (error) {
    console.error('[API] Failed to check profile:', error);
    return false;
  }
};

/**
 * Health check - verify backend is reachable
 * @returns true if backend is healthy, false otherwise
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    if (!isBackendConfigured()) {
      console.error('[API] Backend URL not configured');
      return false;
    }

    const response = await fetch(`${BACKEND_URL}/api/health`);
    const isHealthy = response.ok;
    
    if (isHealthy) {
      console.log('[API] Backend health check passed ✓');
    } else {
      console.error('[API] Backend health check failed:', response.status);
    }
    
    return isHealthy;
  } catch (error) {
    console.error('[API] Backend health check error:', error);
    return false;
  }
};
