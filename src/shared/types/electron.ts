import type { Pomodoro, StartPomodoroParams, Task } from './gomodoro';

export type IpcResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
};

export interface ElectronAPI {
  getConfig: () => Promise<{ env: string }>;
  checkGraphQLConnection: () => Promise<{ isConnected: boolean }>;
  getCurrentPomodoro: () => Promise<Pomodoro | null>;
  startPomodoro: (input: StartPomodoroParams) => Promise<Pomodoro>;
  pausePomodoro: () => Promise<Pomodoro>;
  resumePomodoro: () => Promise<Pomodoro>;
  stopPomodoro: () => Promise<Pomodoro>;
  onPomodoroEvent: (listener: (event: Pomodoro) => void) => () => void;
  // Task management
  listTasks: () => Promise<Task[]>;
  createTask: (input: { title: string }) => Promise<Task>;
  updateTask: (input: { taskId: string; title: string }) => Promise<Task>;
  deleteTask: (input: { taskId: string }) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


