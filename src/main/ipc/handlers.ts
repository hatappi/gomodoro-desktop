import { ipcMain } from 'electron';
import { IPC_CHANNELS } from './channels';
import { GraphQLService } from '../services/GraphQLService';
import PomodoroService from '../services/PomodoroService';
import { GRAPHQL_HTTP_URL, GRAPHQL_WS_URL } from '../../shared/constants';

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

  ipcMain.handle(IPC_CHANNELS.GET_CURRENT_POMODORO, async () => {
    const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
    const service = new PomodoroService(gql);
    const current = await service.getCurrentPomodoro();
    return current;
  });
}


