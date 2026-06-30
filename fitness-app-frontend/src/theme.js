import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6025e0', // Vibrant purple accent from mockup
        light: '#8553e6',
        dark: '#451aa8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ef4444',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0b0f19', // Soft light gray-blue background vs deep dark navy-gray
        paper: mode === 'light' ? '#ffffff' : '#131926',
        sidebar: mode === 'light' ? '#ffffff' : '#0e131f',
        subtle: mode === 'light' ? '#f1f5f9' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#f8fafc',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
      success: {
        main: '#10b981', // Clean green badge
        light: mode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
        dark: '#047857',
        contrastText: '#065f46',
      },
      warning: {
        main: '#f59e0b',
        light: mode === 'light' ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
        dark: '#b45309',
        contrastText: '#92400e',
      },
      info: {
        main: '#3b82f6',
        light: mode === 'light' ? '#dbeafe' : 'rgba(59, 130, 246, 0.15)',
        dark: '#1d4ed8',
        contrastText: '#1e40af',
      },
      divider: mode === 'light' ? '#e2e8f0' : '#1e293b',
    },
    typography: {
      fontFamily: "'Outfit', 'Segoe UI', Roboto, sans-serif",
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body1: { fontWeight: 400 },
      body2: { fontWeight: 400 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: '#4e1bb8',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${mode === 'light' ? '#f1f5f9' : '#1e293b'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};
