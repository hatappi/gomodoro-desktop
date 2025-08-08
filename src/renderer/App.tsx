import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        Gomodoro Desktop 🍅
      </Layout>
    </ThemeProvider>
  );
}


