import React from 'react';
import { ThemeProvider, CssBaseline, Container, Stack } from '@mui/material';
import { theme } from './styles/theme';
import Layout from './components/Layout/Layout';
import Timer from './components/Timer/Timer';
import Controls from './components/Controls/Controls';
import { usePomodoro } from './hooks/usePomodoro';

export default function App(): React.ReactElement {
  const { pomodoro, isLoading, start, pause, resume, stop } = usePomodoro();
  const canStart = !pomodoro || (pomodoro.state !== 'ACTIVE' && pomodoro.state !== 'PAUSED');
  const canPause = !!pomodoro && pomodoro.state === 'ACTIVE';
  const canResume = !!pomodoro && pomodoro.state === 'PAUSED';
  const canStop = !!pomodoro && pomodoro.state !== 'FINISHED';
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}
        >
          <Stack 
            spacing="2rem"
            alignItems="center" 
          >
            <Timer pomodoro={pomodoro} />
            <Controls
              isLoading={isLoading}
              canStart={canStart}
              canPause={canPause}
              canResume={canResume}
              canStop={canStop}
              onStart={() => void start()}
              onPause={() => void pause()}
              onResume={() => void resume()}
              onStop={() => void stop()}
            />
          </Stack>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}


