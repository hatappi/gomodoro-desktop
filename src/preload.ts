// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';

// Expose a minimal, typed API to the renderer (secure bridge)
const api = {
  // Simple health check; this can be expanded to IPC later
  ping: async (message?: string): Promise<string> => {
    return 'pong';
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
