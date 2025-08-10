export const IPC_CHANNELS = {
  PING: 'app:ping',
  GET_CONFIG: 'app:get-config',
  GET_CURRENT_POMODORO: 'pomodoro:get-current',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];


