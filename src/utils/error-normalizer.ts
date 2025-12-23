import axios from 'axios';

export interface NormalizedError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Single source of truth for error normalization
 * Converts any error (axios, network, unknown) to a human-friendly message
 */
export function normalizeError(error: unknown): NormalizedError {
  // Axios error
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Authentication errors
    if (statusCode === 401) {
      return {
        message: 'Your session has expired. Please login again.',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      };
    }

    // Authorization errors
    if (statusCode === 403) {
      return {
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN',
        statusCode: 403,
      };
    }

    // Not found
    if (statusCode === 404) {
      return {
        message: serverMessage || 'The requested resource was not found.',
        code: 'NOT_FOUND',
        statusCode: 404,
      };
    }

    // Validation errors
    if (statusCode === 422) {
      return {
        message: serverMessage || 'Please check your input and try again.',
        code: 'VALIDATION_ERROR',
        statusCode: 422,
      };
    }

    // Server errors
    if (statusCode && statusCode >= 500) {
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        statusCode,
      };
    }

    // Network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. Please try again.',
        code: 'TIMEOUT',
      };
    }

    // Use server message if available
    if (serverMessage) {
      return {
        message: serverMessage,
        code: 'API_ERROR',
        statusCode,
      };
    }

    // Generic axios error
    return {
      message: error.message || 'An unexpected error occurred.',
      code: 'UNKNOWN_ERROR',
      statusCode,
    };
  }

  // Standard Error object
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred.',
      code: 'ERROR',
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR',
    };
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN',
  };
}

/**
 * Get a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  return normalizeError(error).message;
}
