// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../main/ipc/channels';
import { Pomodoro, StartPomodoroParams } from '../shared/types/gomodoro';
import type { IpcResponse } from '../shared/types/electron';

function handleIpcResponse<T>(response: IpcResponse<T>): T {
  if (!response.success || response.error) {
    throw new Error(response.error?.message || 'IPC call failed');
  }
  return response.data as T;
}

async function invokeIpc<T>(channel: string, ...args: any[]): Promise<T> {
  const res = await ipcRenderer.invoke(channel, ...args);
  return handleIpcResponse<T>(res);
}

// Expose a minimal, typed API to the renderer (secure bridge)
const api = {
  // Simple health check; this can be expanded to IPC later
  ping: async (message?: string) => {
    const result = await invokeIpc<string>(IPC_CHANNELS.PING, message ?? '');
    return String(result);
  },
  getConfig: () => invokeIpc<{ env: string }>(IPC_CHANNELS.GET_CONFIG),
  getCurrentPomodoro: () => invokeIpc<Pomodoro | null>(IPC_CHANNELS.GET_CURRENT_POMODORO),
  startPomodoro: (input: StartPomodoroParams) => invokeIpc<Pomodoro>(IPC_CHANNELS.START_POMODORO, input),
  pausePomodoro: () => invokeIpc<Pomodoro>(IPC_CHANNELS.PAUSE_POMODORO),
  resumePomodoro: () => invokeIpc<Pomodoro>(IPC_CHANNELS.RESUME_POMODORO),
  stopPomodoro: () => invokeIpc<Pomodoro>(IPC_CHANNELS.STOP_POMODORO),
  onPomodoroEvent: (listener: (event: Pomodoro) => void) => {
    const handler = (_: unknown, payload: Pomodoro) => listener(payload);
    ipcRenderer.on(IPC_CHANNELS.POMODORO_EVENT, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.POMODORO_EVENT, handler);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);


