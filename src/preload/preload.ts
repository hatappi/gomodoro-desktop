// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../main/ipc/channels';

// Expose a minimal, typed API to the renderer (secure bridge)
const api = {
  // Simple health check; this can be expanded to IPC later
  ping: async (message?: string): Promise<string> => {
    const res = await ipcRenderer.invoke(IPC_CHANNELS.PING, message ?? '');
    return String(res);
  },
  getConfig: async (): Promise<{ env: string }> => {
    const res = await ipcRenderer.invoke(IPC_CHANNELS.GET_CONFIG);
    return res as { env: string };
  },
  getCurrentPomodoro: async (): Promise<any> => {
    const res = await ipcRenderer.invoke(IPC_CHANNELS.GET_CURRENT_POMODORO);
    return res as any;
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);


