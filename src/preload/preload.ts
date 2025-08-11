// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../main/ipc/channels';
import { Pomodoro, StartPomodoroParams } from '../shared/types/gomodoro';

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
  getCurrentPomodoro: async () => {
    return (await ipcRenderer.invoke(IPC_CHANNELS.GET_CURRENT_POMODORO));
  },
  startPomodoro: async (input: StartPomodoroParams) => {
    return (await ipcRenderer.invoke(IPC_CHANNELS.START_POMODORO, input));
  },
  pausePomodoro: async () => {
    return (await ipcRenderer.invoke(IPC_CHANNELS.PAUSE_POMODORO));
  },
  resumePomodoro: async () => {
    return (await ipcRenderer.invoke(IPC_CHANNELS.RESUME_POMODORO));
  },
  stopPomodoro: async () => {
    return (await ipcRenderer.invoke(IPC_CHANNELS.STOP_POMODORO));
  },
  onPomodoroEvent: (listener: (event: Pomodoro) => void) => {
    const handler = (_: unknown, payload: Pomodoro) => listener(payload);
    ipcRenderer.on(IPC_CHANNELS.POMODORO_EVENT, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.POMODORO_EVENT, handler);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);


