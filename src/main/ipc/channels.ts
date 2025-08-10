export const IPC_CHANNELS = {
  PING: 'app:ping',
  GET_CONFIG: 'app:get-config',
  GET_CURRENT_POMODORO: 'pomodoro:get-current',
  START_POMODORO: 'pomodoro:start',
  PAUSE_POMODORO: 'pomodoro:pause',
  RESUME_POMODORO: 'pomodoro:resume',
  STOP_POMODORO: 'pomodoro:stop',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];


