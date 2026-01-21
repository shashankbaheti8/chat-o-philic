import { format, isToday, isYesterday } from 'date-fns';

/**
 * Get relative time string (e.g., "2m ago", "5h ago")
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return format(date, 'MMM d');
};

/**
 * Get short relative time (e.g., "2m", "5h")
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Short relative time
 */
export const getShortRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  
  return format(date, 'MMM d');
};

/**
 * Get full timestamp for messages (e.g., "2:30 PM", "Yesterday 2:30 PM")
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted timestamp
 */
export const getMessageTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  }
  
  return format(date, 'MMM d, h:mm a');
};

/**
 * Get chat list timestamp (e.g., "2:30 PM", "Yesterday", "Jan 15")
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted timestamp for chat list
 */
export const getChatListTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return format(date, 'EEEE'); // Day name
  }
  
  return format(date, 'MMM d');
};
