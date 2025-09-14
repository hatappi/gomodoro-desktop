import { registerIpcHandlers } from '../ipc/handlers';
import { GraphQLService } from '../services/GraphQLService';
import { GRAPHQL_HTTP_URL, GRAPHQL_WS_URL } from '../../shared/constants';
import PomodoroService from '../services/PomodoroService';
import TrayManager from './TrayManager';
import NotificationService from '../services/NotificationService';
import { spawn, ChildProcess } from 'child_process';
import { globalShortcut } from 'electron';
import log from 'electron-log/main'

export default class Application {
  private gql: GraphQLService | null = null;
  private pomodoroService: PomodoroService | null = null;
  private trayManager: TrayManager | null = null;
  private gomodoroCLIProcess: ChildProcess | null = null;

  public async init(): Promise<void> {
    this.gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });

    const ok = await this.gql.testReconnect(2);
    if (!ok) {
      try {
        this.gomodoroCLIProcess = spawn('/usr/local/bin/gomodoro', ['serve'], {
          detached: false,
          stdio: 'pipe'
        });

        this.gomodoroCLIProcess.on('error', (error) => {
          log.error('[Application] Failed to start gomodoro server:', error);
        });

        this.gomodoroCLIProcess.on('exit', (code) => {
          this.gomodoroCLIProcess = null;
        });

      } catch (error) {
        log.error('[Application] Error starting gomodoro server:', error);
      }
    }

    this.pomodoroService = new PomodoroService(this.gql);
    const notificationService = new NotificationService();

    this.trayManager = new TrayManager(this.pomodoroService, undefined, notificationService);
    this.trayManager.init();
    
    this.registerGlobalShortcuts();
    
    registerIpcHandlers(this.gql);
  }

  public async destroy(): Promise<void> {
    globalShortcut.unregisterAll();
    this.trayManager?.destroy();
    
    if (this.gomodoroCLIProcess) {
      try {
        log.info('[Application] Stopping gomodoro server...');
        this.gomodoroCLIProcess.kill();
        this.gomodoroCLIProcess = null;
      } catch (error) {
        log.error('[Application] Error stopping gomodoro server:', error);
      }
    }
  }

  private registerGlobalShortcuts(): void {
    const ret = globalShortcut.register('CommandOrControl+Ctrl+G', () => {
      this.trayManager?.showTrayMenu();
    });

    if (!ret) {
      log.error('[Application] Failed to register global shortcut');
    }
  }
}
