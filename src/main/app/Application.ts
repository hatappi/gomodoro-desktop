import { registerIpcHandlers } from '../ipc/handlers';
import { GraphQLService } from '../services/GraphQLService';
import { GRAPHQL_HTTP_URL, GRAPHQL_WS_URL } from '../../shared/constants';
import PomodoroService from '../services/PomodoroService';
import TrayManager from './TrayManager';
import NotificationService from '../services/NotificationService';
import { spawn, ChildProcess } from 'child_process';

export default class Application {
  private gql: GraphQLService | null = null;
  private pomodoroService: PomodoroService | null = null;
  private trayManager: TrayManager | null = null;
  private gomodoroCLIProcess: ChildProcess | null = null;

  public async init(): Promise<void> {
    // Minimal initialization (Tray, IPC, Services will be added later)
    // Startup log only for now
    // eslint-disable-next-line no-console
    console.log('[Application] init');
    registerIpcHandlers();

    // Initialize GraphQL service and run a connection check
    this.gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });

    const ok = await this.gql.testReconnect(2);
    if (!ok) {
      try {
        this.gomodoroCLIProcess = spawn('gomodoro', ['serve'], {
          detached: false,
          stdio: 'pipe'
        });

        this.gomodoroCLIProcess.on('error', (error) => {
          // eslint-disable-next-line no-console
          console.error('[Application] Failed to start gomodoro server:', error);
        });

        this.gomodoroCLIProcess.on('exit', (code) => {
          // eslint-disable-next-line no-console
          console.log(`[Application] gomodoro server exited with code ${code}`);
          this.gomodoroCLIProcess = null;
        });

        // eslint-disable-next-line no-console
        console.log('[Application] gomodoro server started');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Application] Error starting gomodoro server:', error);
      }
    }

    // Initialize services used by Tray
    this.pomodoroService = new PomodoroService(this.gql);
    const notificationService = new NotificationService();
    this.trayManager = new TrayManager(this.pomodoroService, undefined, notificationService);
    this.trayManager.init();
  }

  public async destroy(): Promise<void> {
    this.trayManager?.destroy();
    
    if (this.gomodoroCLIProcess) {
      try {
        // eslint-disable-next-line no-console
        console.log('[Application] Stopping gomodoro server...');
        this.gomodoroCLIProcess.kill();
        this.gomodoroCLIProcess = null;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Application] Error stopping gomodoro server:', error);
      }
    }
  }
}


