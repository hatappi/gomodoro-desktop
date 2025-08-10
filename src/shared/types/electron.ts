export interface ElectronAPI {
  ping: (message?: string) => Promise<string>;
  getConfig: () => Promise<{ env: string }>;
  getCurrentPomodoro: () => Promise<unknown>;
  startPomodoro: (input: { workDurationSec: number; breakDurationSec: number; longBreakDurationSec: number; taskId: string }) => Promise<unknown>;
  pausePomodoro: () => Promise<unknown>;
  resumePomodoro: () => Promise<unknown>;
  stopPomodoro: () => Promise<unknown>;
  onPomodoroEvent: (listener: (event: unknown) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


