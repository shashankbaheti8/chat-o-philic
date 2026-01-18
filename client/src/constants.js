// Sharp, Modern, Minimal Design System

// Color Palette - Professional & Sophisticated
export const COLORS = {
  // Primary - Deep Blue (Professional)
  primary: '#0F172A',         // Slate 900
  primaryLight: '#1E293B',    // Slate 800
  primaryHover: '#334155',    // Slate 700
  
  // Accent - Electric Blue
  accent: '#3B82F6',          // Blue 500
  accentHover: '#2563EB',     // Blue 600
  accentLight: '#60A5FA',     // Blue 400
  
  // Light Mode
  backgroundLight: '#FFFFFF',
  surfaceLight: '#F8FAFC',    // Slate 50
  borderLight: '#E2E8F0',     // Slate 200
  
  textPrimaryLight: '#0F172A', // Slate 900
  textSecondaryLight: '#64748B', // Slate 500
  
  // Dark Mode
  backgroundDark: '#0A0A0A',   // Almost black
  surfaceDark: '#141414',      // Dark gray
  borderDark: '#1F1F1F',       // Subtle border
  
  textPrimaryDark: '#FAFAFA',  // Almost white
  textSecondaryDark: '#A3A3A3', // Neutral 400
  
  // Message Colors
  sentMessage: '#3B82F6',      // Blue
  receivedMessage: '#F1F5F9',  // Light gray
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Online Status
  online: '#10B981',
  away: '#F59E0B',
  offline: '#6B7280',
};

// UI Constants - Sharp & Minimal
export const UI = {
  // NO CURVES - Sharp edges
  BORDER_RADIUS: 0,           // Sharp corners everywhere
  BORDER_RADIUS_SM: 2,        // Tiny for buttons if needed
  
  // Spacing
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 16,
  SPACING_LG: 24,
  SPACING_XL: 32,
  
  // Layout
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 56,
  
  // Borders
  BORDER_WIDTH: 1,
  BORDER_SOLID: '1px solid',
  
  // Shadows - Subtle, not prominent
  SHADOW_SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  SHADOW_MD: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  SHADOW_LG: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
};

// Typography - Bold Hierarchy
export const TYPOGRAPHY = {
  // Use system fonts for speed & clarity
  FONT_FAMILY: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif',
  
  // Font Weights
  WEIGHT_REGULAR: 400,
  WEIGHT_MEDIUM: 500,
  WEIGHT_SEMIBOLD: 600,
  WEIGHT_BOLD: 700,
  
  // Sizes
  SIZE_XS: '0.75rem',    // 12px
  SIZE_SM: '0.875rem',   // 14px
  SIZE_BASE: '1rem',     // 16px
  SIZE_LG: '1.125rem',   // 18px
  SIZE_XL: '1.25rem',    // 20px
  SIZE_2XL: '1.5rem',    // 24px
  SIZE_3XL: '1.875rem',  // 30px
};

// Animations - Fast & Subtle
export const ANIMATIONS = {
  DURATION_FAST: 100,
  DURATION_NORMAL: 150,
  DURATION_SLOW: 200,
  
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Socket Events
export const SOCKET_EVENTS = {
  SETUP: 'setup',
  CONNECTED: 'connected',
  JOIN_CHAT: 'join chat',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  NEW_MESSAGE: 'new message',
  MESSAGE_RECEIVED: 'message received',
  MESSAGE_READ: 'message read',
};

// Pagination
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  CHATS_PER_PAGE: 20,
};
