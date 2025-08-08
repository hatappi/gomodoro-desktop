import { ipcMain } from 'electron';
import { IPC_CHANNELS } from './channels';

export function registerIpcHandlers(): void {
  // Simple ping handler to validate the wiring end-to-end
  ipcMain.handle(IPC_CHANNELS.PING, async (_event, message?: string) => {
    return `pong:${message ?? ''}`;
  });

  // Example config retrieval (placeholder)
  ipcMain.handle(IPC_CHANNELS.GET_CONFIG, async () => {
    return {
      env: process.env.NODE_ENV ?? 'development',
    };
  });
}


