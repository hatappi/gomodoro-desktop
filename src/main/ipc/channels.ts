export const IPC_CHANNELS = {
  GET_CONFIG: "app:get-config",
  CHECK_GRAPHQL_CONNECTION: "app:check-graphql-connection",
  SHOW_TASK_MANAGER: "app:show-task-manager",
  GET_CURRENT_POMODORO: "pomodoro:get-current",
  START_POMODORO: "pomodoro:start",
  PAUSE_POMODORO: "pomodoro:pause",
  RESUME_POMODORO: "pomodoro:resume",
  STOP_POMODORO: "pomodoro:stop",
  RESET_POMODORO: "pomodoro:reset",
  POMODORO_EVENT: "pomodoro:event",
  LIST_TASKS: "task:list",
  CREATE_TASK: "task:create",
  UPDATE_TASK: "task:update",
  DELETE_TASK: "task:delete",
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
