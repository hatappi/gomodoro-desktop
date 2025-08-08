export interface ElectronAPI {
  ping: (message?: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


