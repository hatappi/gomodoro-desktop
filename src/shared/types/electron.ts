export interface ElectronAPI {
  ping: (message?: string) => Promise<string>;
  getConfig: () => Promise<{ env: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


