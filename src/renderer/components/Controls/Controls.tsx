import React from 'react';
import { 
  Button, 
  Stack, 
  IconButton, 
  Tooltip, 
  Box,
  CircularProgress,
  Chip,
  darken,
  lighten,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SwapHoriz as ChangeTaskIcon,
} from '@mui/icons-material';

type ControlAction = {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  color: 'primary' | 'warning' | 'success';
  size: 'large';
};

type Props = {
  isLoading: boolean;
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  canStop: boolean;
  isFinished: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onChangeTask: () => void;
};

export default function Controls(props: Props): React.ReactElement {
  const { isLoading, canStart, canPause, canResume, canStop, isFinished, onStart, onPause, onResume, onStop, onChangeTask } = props;

  // Main action button (Start/Pause/Resume)
  const primaryAction: ControlAction | null = (() => {
    if (canStart) {
      return {
        label: 'Start',
        icon: <PlayIcon sx={{ fontSize: 'clamp(1rem, 3vw, 2rem)' }} />,
        onClick: onStart,
        color: 'primary',
        size: 'large',
      };
    }
    if (canPause) {
      return {
        label: 'Pause',
        icon: <PauseIcon sx={{ fontSize: 'clamp(1rem, 3vw, 2rem)' }} />,
        onClick: onPause,
        color: 'warning',
        size: 'large',
      };
    }
    if (canResume) {
      return {
        label: 'Resume',
        icon: <PlayIcon sx={{ fontSize: 'clamp(1rem, 3vw, 2rem)' }} />,
        onClick: onResume,
        color: 'success',
        size: 'large',
      };
    }
    return null;
  })();

  return (
    <Box>
      {isLoading && (
        <Chip
          icon={<CircularProgress size='clamp(12px, 2vw, 20px)' />}
          label="Processing..."
          size="small"
          sx={{
            fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
            mb: 'clamp(0.5rem, 1vw, 1rem)',
          }}
        />
      )}

      <Stack direction="row" spacing={2} alignItems="center">
        {primaryAction && (
          <Button
            variant="contained"
            color={primaryAction.color}
            size={primaryAction.size}
            startIcon={primaryAction.icon}
            disabled={isLoading}
            onClick={primaryAction.onClick}
            sx={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)',
              height: 'clamp(40px, 8vw, 64px)',
              minWidth: 'clamp(100px, 15vw, 180px)',
              px: 'clamp(1rem, 4vw, 3rem)',
              boxShadow: (theme) => `0 4px 14px 0 ${theme.palette[primaryAction.color].main}33`,
              '&:hover': {
                boxShadow: (theme) => `0 6px 20px 0 ${theme.palette[primaryAction.color].main}44`,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {primaryAction.label}
          </Button>
        )}
        
        {isFinished && (
          <Tooltip title="Change Task" arrow>
            <span>
              <IconButton
                disabled={isLoading}
                onClick={onChangeTask}
                sx={{
                  height: 'clamp(40px, 8vw, 64px)',
                  width: 'clamp(40px, 8vw, 64px)',
                  borderRadius: 6,
                  backgroundColor: (theme) => lighten(theme.palette.info.main, 0.1),
                  border: (theme) => `2px solid ${theme.palette.info.main}33`,
                  '&:hover': {
                    backgroundColor: (theme) => darken(theme.palette.info.main, 0.1),
                    borderColor: (theme) => `${theme.palette.info.main}66`,
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'transparent',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ChangeTaskIcon sx={{ fontSize: 'clamp(1.2rem, 4vw, 2.5rem)' }} />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {(!isFinished) && (
          <Tooltip title="Stop Timer" arrow>
            <span>
              <IconButton
                disabled={isLoading || !canStop}
                onClick={onStop}
                sx={{
                  height: 'clamp(40px, 8vw, 64px)',
                  width: 'clamp(40px, 8vw, 64px)',
                  borderRadius: 6,
                  backgroundColor: (theme) => lighten(theme.palette.error.main, 0.1),
                  border: (theme) => `2px solid ${theme.palette.error.main}33`,
                  '&:hover': {
                    backgroundColor: (theme) => darken(theme.palette.error.main, 0.1),
                    borderColor: (theme) => `${theme.palette.error.main}66`,
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'transparent',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <StopIcon sx={{ fontSize: 'clamp(1.2rem, 4vw, 2.5rem)' }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}


