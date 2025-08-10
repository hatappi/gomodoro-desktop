export interface ElectronAPI {
  ping: (message?: string) => Promise<string>;
  getConfig: () => Promise<{ env: string }>;
  getCurrentPomodoro: () => Promise<unknown>;
  startPomodoro: (input: { workDurationSec: number; breakDurationSec: number; longBreakDurationSec: number; taskId: string }) => Promise<unknown>;
  pausePomodoro: () => Promise<unknown>;
  resumePomodoro: () => Promise<unknown>;
  stopPomodoro: () => Promise<unknown>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


