import type { Pomodoro, StartPomodoroParams } from './gomodoro';

export interface ElectronAPI {
  ping: (message?: string) => Promise<string>;
  getConfig: () => Promise<{ env: string }>;
  getCurrentPomodoro: () => Promise<Pomodoro | null>;
  startPomodoro: (input: StartPomodoroParams) => Promise<Pomodoro>;
  pausePomodoro: () => Promise<Pomodoro>;
  resumePomodoro: () => Promise<Pomodoro>;
  stopPomodoro: () => Promise<Pomodoro>;
  onPomodoroEvent: (listener: (event: Pomodoro) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


