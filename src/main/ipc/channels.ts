export const IPC_CHANNELS = {
  PING: 'app:ping',
  GET_CONFIG: 'app:get-config',
  GET_CURRENT_POMODORO: 'pomodoro:get-current',
  START_POMODORO: 'pomodoro:start',
  PAUSE_POMODORO: 'pomodoro:pause',
  RESUME_POMODORO: 'pomodoro:resume',
  STOP_POMODORO: 'pomodoro:stop',
  POMODORO_EVENT: 'pomodoro:event',
  LIST_TASKS: 'task:list',
  CREATE_TASK: 'task:create',
  UPDATE_TASK: 'task:update',
  DELETE_TASK: 'task:delete',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];


