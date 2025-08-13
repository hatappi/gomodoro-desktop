import { registerIpcHandlers } from '../ipc/handlers';
import { GraphQLService } from '../services/GraphQLService';
import { GRAPHQL_HTTP_URL, GRAPHQL_WS_URL } from '../../shared/constants';
import PomodoroService from '../services/PomodoroService';
import TrayManager from './TrayManager';

export default class Application {
  private gql: GraphQLService | null = null;
  private pomodoroService: PomodoroService | null = null;
  private trayManager: TrayManager | null = null;

  public async init(): Promise<void> {
    // Minimal initialization (Tray, IPC, Services will be added later)
    // Startup log only for now
    // eslint-disable-next-line no-console
    console.log('[Application] init');
    registerIpcHandlers();

    // Initialize GraphQL service and run a connection check
    this.gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
    const ok = await this.gql.testReconnect(2);
    // eslint-disable-next-line no-console
    console.log(`[GraphQL] health: ${ok}`);

    // Initialize services used by Tray
    this.pomodoroService = new PomodoroService(this.gql);
    this.trayManager = new TrayManager(this.pomodoroService);
    this.trayManager.init();
  }

  public async destroy(): Promise<void> {
    this.trayManager?.destroy();
  }
}


