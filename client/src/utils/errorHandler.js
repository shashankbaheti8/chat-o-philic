/**
 * Centralized error handling utility for API errors
 */

/**
 * Extract error message from API error response
 * @param {Error} error - The error object from axios
 * @param {string} defaultMessage - Default message if no specific error found
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error, defaultMessage = 'Something went wrong. Please try again.') => {
  // Check for response error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for response error string
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Check for network errors
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }
  
  // Check for timeout
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  // Check for 401 unauthorized
  if (error.response?.status === 401) {
    return 'Session expired. Please login again.';
  }
  
  // Check for 403 forbidden
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  // Check for 404 not found
  if (error.response?.status === 404) {
    return 'Resource not found.';
  }
  
  // Check for 500 server error
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return defaultMessage;
};

/**
 * Handle async operations with retry logic
 * @param {Function} operation - Async function to execute
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - Result of the operation
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 2000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 408 (timeout)
      if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 408) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }
  
  throw lastError;
};

/**
 * Show toast notification for errors
 * @param {import('react-toastify').toast} toast - Toast instance from react-toastify
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message
 */
export const showErrorToast = (toast, error, defaultMessage) => {
  const message = handleApiError(error, defaultMessage);
  toast.error(message);
};

/**
 * Show toast notification for success
 * @param {import('react-toastify').toast} toast - Toast instance from react-toastify
 * @param {string} message - Success message
 */
export const showSuccessToast = (toast, message) => {
  toast.success(message);
};
