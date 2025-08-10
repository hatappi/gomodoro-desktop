import React from 'react';
import { Button, Stack } from '@mui/material';

type Props = {
  isLoading: boolean;
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  canStop: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

export default function Controls(props: Props): React.ReactElement {
  const { isLoading, canStart, canPause, canResume, canStop, onStart, onPause, onResume, onStop } = props;
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" disabled={isLoading || !canStart} onClick={onStart}>
        Start
      </Button>
      <Button variant="outlined" disabled={isLoading || !canPause} onClick={onPause}>
        Pause
      </Button>
      <Button variant="outlined" disabled={isLoading || !canResume} onClick={onResume}>
        Resume
      </Button>
      <Button color="error" variant="contained" disabled={isLoading || !canStop} onClick={onStop}>
        Stop
      </Button>
    </Stack>
  );
}


