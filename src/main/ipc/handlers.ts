import { BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS } from './channels';
import { GraphQLService } from '../services/GraphQLService';
import PomodoroService from '../services/PomodoroService';
import type { IpcResponse } from '../../shared/types/electron';

function handleIpcError(error: unknown): IpcResponse {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;
  
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

export function registerIpcHandlers(gql: GraphQLService): void {
  // Example config retrieval (placeholder)
  ipcMain.handle(IPC_CHANNELS.GET_CONFIG, async () => {
    return withIpcErrorHandling(async () => ({
      env: process.env.NODE_ENV ?? 'development',
    }));
  });

  // GraphQL connection check
  ipcMain.handle(IPC_CHANNELS.CHECK_GRAPHQL_CONNECTION, async () => {
    return withIpcErrorHandling(async () => {
      const isConnected = await gql.testReconnect(2);
      return { isConnected };
    });
  });

  const pomodoroService = new PomodoroService(gql);

  ipcMain.handle(IPC_CHANNELS.GET_CURRENT_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.getCurrentPomodoro();
    });
  });

  ipcMain.handle(IPC_CHANNELS.START_POMODORO, async (_e, input: { workDurationSec: number; breakDurationSec: number; longBreakDurationSec: number; taskId: string }) => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.startPomodoro(input);
    });
  });

  ipcMain.handle(IPC_CHANNELS.PAUSE_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.pausePomodoro();
    });
  });

  ipcMain.handle(IPC_CHANNELS.RESUME_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.resumePomodoro();
    });
  });

  ipcMain.handle(IPC_CHANNELS.STOP_POMODORO, async () => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.stopPomodoro();
    });
  });

  // Task management handlers
  ipcMain.handle(IPC_CHANNELS.LIST_TASKS, async () => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.listTasks();
    });
  });

  ipcMain.handle(IPC_CHANNELS.CREATE_TASK, async (_e, input: { title: string }) => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.createTask(input);
    });
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_TASK, async (_e, input: { taskId: string; title: string }) => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.updateTask({ id: input.taskId, title: input.title });
    });
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_TASK, async (_e, input: { taskId: string }) => {
    return withIpcErrorHandling(async () => {
      return pomodoroService.deleteTask(input.taskId);
    });
  });

  // Broadcast subscription events to all renderer windows
  pomodoroService.subscribePomodoroEvents(
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


