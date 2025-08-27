import React from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  Coffee as BreakIcon,
} from '@mui/icons-material';
import type { Pomodoro, PomodoroPhase, Task } from '../../../shared/types/gomodoro';

type PhaseConfig = {
  icon: React.ReactElement;
  label: string;
  color: 'primary' | 'success' | 'info' | 'default';
};

type Props = {
  pomodoro: Pomodoro | null;
  tasks: Task[];
};

const PHASE_CONFIG: Record<PomodoroPhase, PhaseConfig> = {
  WORK: {
    icon: <WorkIcon sx={{ fontSize: 'clamp(0.8rem, 2vw, 1.5rem)' }} />,
    label: 'Work',
    color: 'primary',
  },
  SHORT_BREAK: {
    icon: <BreakIcon sx={{ fontSize: 'clamp(0.8rem, 2vw, 1.5rem)' }} />,
    label: 'Short Break',
    color: 'success',
  },
  LONG_BREAK: {
    icon: <BreakIcon sx={{ fontSize: 'clamp(0.8rem, 2vw, 1.5rem)' }} />,
    label: 'Long Break',
    color: 'info',
  },
} as const;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getPhaseConfig = (phase: string): PhaseConfig => {
  if (phase in PHASE_CONFIG) {
    return PHASE_CONFIG[phase as PomodoroPhase];
  }

  return {
    icon: <ScheduleIcon sx={{ fontSize: '1rem' }} />,
    label: phase,
    color: 'default',
  };
};

export default function Timer({ pomodoro, tasks }: Props): React.ReactElement {
  if (!pomodoro) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center',
        }}
      >
        <ScheduleIcon sx={{ fontSize: 'clamp(2rem, 4vw, 4rem)', color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          Ready to start
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Click Start to begin your Pomodoro session
        </Typography>
      </Box>
    );
  }

  const phaseConfig = getPhaseConfig(pomodoro.phase);
  const currentTask = tasks.find(task => task.id === pomodoro.taskId);
  
  return (
    <Box>
      <Stack spacing={3} alignItems="center">
          {/* Phase indicator */}
          <Chip
            icon={phaseConfig.icon}
            label={`${phaseConfig.label} #${pomodoro.phaseCount}`}
            color={phaseConfig.color}
            variant="outlined"
            sx={{
              fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)',
              py: 'clamp(0.5rem, 2vw, 1rem)'
            }}
          />

          {/* Circular progress with timer */}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={(pomodoro.phaseDurationSec - pomodoro.remainingTimeSec) / pomodoro.phaseDurationSec * 100}
              size='clamp(200px, 40vw, 500px)'
              sx={{
                color: (theme) => {
                  const colorKey = phaseConfig.color === 'default' ? 'primary' : phaseConfig.color;
                  return theme.palette[colorKey].main;
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography 
                sx={{ 
                  fontWeight: 300,
                  fontFamily: 'monospace',
                  fontSize: 'clamp(2rem, 8vw, 6rem)',
                }}
              >
                {formatTime(pomodoro.remainingTimeSec)}
              </Typography>
            </Box>
          </Box>

          {/* Task name */}
          {currentTask && (
            <Typography 
              variant="h6" 
              color="text.primary"
              sx={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              }}
            >
              {currentTask.title}
            </Typography>
          )}

          {/* Status indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 'clamp(6px, 1.5vw, 12px)',
                height: 'clamp(6px, 1.5vw, 12px)',
                borderRadius: '50%',
                bgcolor: pomodoro.state === 'ACTIVE' ? 'success.main' : 
                        pomodoro.state === 'PAUSED' ? 'warning.main' : 'text.secondary',
                animation: pomodoro.state === 'ACTIVE' ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
            <Typography 
              color="text.secondary"
              sx={{ textTransform: 'capitalize', fontSize: 'clamp(0.75rem, 3vw, 1.5rem)' }}
            >
              {pomodoro.state.toLowerCase()}
            </Typography>
          </Box>
        </Stack>
    </Box>
  );
}