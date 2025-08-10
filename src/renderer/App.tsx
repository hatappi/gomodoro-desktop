import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import Controls from './components/Controls/Controls';
import { usePomodoro } from './hooks/usePomodoro';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App(): React.ReactElement {
  const { pomodoro, isLoading, start, pause, resume, stop } = usePomodoro();
  const canStart = !pomodoro || pomodoro.state !== 'ACTIVE';
  const canPause = !!pomodoro && pomodoro.state === 'ACTIVE';
  const canResume = !!pomodoro && pomodoro.state === 'PAUSED';
  const canStop = !!pomodoro && pomodoro.state !== 'FINISHED';
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div>
            {pomodoro ? (
              <div>
                <div>Phase: {pomodoro.phase}</div>
                <div>Remaining: {pomodoro.remainingTimeSec}s</div>
                <div>State: {pomodoro.state}</div>
              </div>
            ) : (
              'Idle'
            )}
          </div>
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
        </div>
      </Layout>
    </ThemeProvider>
  );
}


