import { registerIpcHandlers } from '../ipc/handlers';
import { GraphQLService } from '../services/GraphQLService';
import { GRAPHQL_HTTP_URL, GRAPHQL_WS_URL } from '../../shared/constants';

export default class Application {
  public async init(): Promise<void> {
    // Minimal initialization (Tray, IPC, Services will be added later)
    // Startup log only for now
    // eslint-disable-next-line no-console
    console.log('[Application] init');
    registerIpcHandlers();

    // Initialize GraphQL service and run a connection check
    const gql = new GraphQLService({ httpUrl: GRAPHQL_HTTP_URL, wsUrl: GRAPHQL_WS_URL });
    const ok = await gql.testReconnect(2);
    // eslint-disable-next-line no-console
    console.log(`[GraphQL] health: ${ok}`);
  }
}


