import { BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS } from './channels';
import { GraphQLService } from '../services/GraphQLService';
import PomodoroService from '../services/PomodoroService';
import { GRAPHQL_HTTP_URL, GRAPHQL_WS_URL } from '../../shared/constants';
import type { IpcResponse } from '../../shared/types/electron';

function handleIpcError(error: unknown): IpcResponse {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;
  console.error('IPC Error:', error);
  
  return {
    success: false,
    error: {
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
    },
  };
}

function createSuccessResponse<T>(data: T): IpcResponse<T> {
  return {
    success: true,
    data,
  };
}

async function withIpcErrorHandling<T>(handler: () => Promise<T>): Promise<IpcResponse<T>> {
  try {
    const result = await handler();
    return createSuccessResponse(result);
  } catch (error) {
    return handleIpcError(error) as IpcResponse<T>;
  }
}

export function registerIpcHandlers(): void {
  // Simple ping handler to validate the wiring end-to-end
  ipcMain.handle(IPC_CHANNELS.PING, async (_event, message?: string) => {
    return withIpcErrorHandling(async () => `pong:${message ?? ''}`);
  });

  // Example config retrieval (placeholder)
  ipcMain.handle(IPC_CHANNELS.GET_CONFIG, async () => {
    return withIpcErrorHandling(async () => ({
      env: process.env.NODE_ENV ?? 'development',
    }));
  });

  ipcMain.handle(IPC_CHANNELS.GET_CURRENT_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
      const service = new PomodoroService(gql);
      return service.getCurrentPomodoro();
    });
  });

  ipcMain.handle(IPC_CHANNELS.START_POMODORO, async (_e, input: { workDurationSec: number; breakDurationSec: number; longBreakDurationSec: number; taskId: string }) => {
    return withIpcErrorHandling(async () => {
      const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
      const service = new PomodoroService(gql);
      return service.startPomodoro(input);
    });
  });

  ipcMain.handle(IPC_CHANNELS.PAUSE_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
      const service = new PomodoroService(gql);
      return service.pausePomodoro();
    });
  });

  ipcMain.handle(IPC_CHANNELS.RESUME_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
      const service = new PomodoroService(gql);
      return service.resumePomodoro();
    });
  });

  ipcMain.handle(IPC_CHANNELS.STOP_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
      const service = new PomodoroService(gql);
      return service.stopPomodoro();
    });
  });

  // Broadcast subscription events to all renderer windows
  {
    const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
    const service = new PomodoroService(gql);
    service.subscribePomodoroEvents(
      (p) => {
        BrowserWindow.getAllWindows().forEach((win) => {
          win.webContents.send(IPC_CHANNELS.POMODORO_EVENT, p);
        });
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Pomodoro subscription error:', err);
      },
    );
  }
}


