export interface ElectronAPI {
  ping: (message?: string) => Promise<string>;
  getConfig: () => Promise<{ env: string }>;
  getCurrentPomodoro: () => Promise<unknown>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


