// Theme Configuration for Simon Fleet Monitor

export const COLORS = {
 
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#60A5FA',
  
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  critical: '#DC2626',
  alert: '#F59E0B',
  
  
  black: '#1F2937',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  background: '#F9FAFB',
  surface: '#FFFFFF',
  
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
};

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

export const Z_INDEX = {
  dropdown: 1000,
  modal: 2000,
  tooltip: 3000,
  notification: 4000,
};

export default {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  BREAKPOINTS,
  Z_INDEX,
};