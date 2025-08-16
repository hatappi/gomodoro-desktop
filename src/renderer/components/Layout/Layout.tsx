import React from 'react';
import { Box, alpha } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props): React.ReactElement {
  return (
    <Box 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: (theme) => `
          radial-gradient(circle at 30% 20%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 50%),
          ${theme.palette.background.default}
        `,
      }}
    >
      <Box sx={{ flex: 1, position: 'relative' }}>
        {children}
      </Box>
    </Box>
  );
}


