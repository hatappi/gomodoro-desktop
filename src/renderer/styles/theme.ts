import { createTheme } from '@mui/material/styles';

const focusOutline = {
  outline: '2px solid #90caf9',
  outlineOffset: 2,
  borderRadius: 4,
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0e13',
      paper: '#151a21',
    },
    primary: {
      main: '#64b5f6',
      dark: '#42a5f5',
      light: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    success: {
      main: '#81c784',
    },
    warning: {
      main: '#ffb74d',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#29b6f6',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 300,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        body: {
          backgroundColor: '#0a0e13',
          color: '#ffffff',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        'button:focus-visible, a:focus-visible, [tabindex]:focus-visible': focusOutline,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: false,
        variant: 'contained',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        arrow: {
          color: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },
  },
});

export default theme;


