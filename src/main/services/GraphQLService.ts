import { setTimeout as delay } from 'node:timers/promises';
import { createClient, Client, ClientOptions } from 'graphql-ws';
import WebSocket from 'ws';

export type GraphQLServiceOptions = {
  httpUrl: string;
  wsUrl: string;
  authToken?: string;
};

export class GraphQLService {
  private readonly httpUrl: string;
  private readonly wsUrl: string;
  private readonly authToken?: string;
  private wsClient: Client | null = null;

  constructor(options: GraphQLServiceOptions) {
    this.httpUrl = options.httpUrl;
    this.wsUrl = options.wsUrl;
    this.authToken = options.authToken;
  }

  public async healthCheck(): Promise<boolean> {
    // Minimal HEAD/GET ping against HTTP endpoint
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(this.httpUrl, { method: 'POST', signal: controller.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query: '{ __typename }' }) });
      clearTimeout(id);
      return res.ok;
    } catch {
      return false;
    }
  }

  public async testReconnect(maxAttempts = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const ok = await this.healthCheck();
      if (ok) return true;
      await delay(500 * attempt);
    }
    return false;
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.authToken) headers.authorization = `Bearer ${this.authToken}`;
    return headers;
  }

  public async execute<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.httpUrl, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({ query, variables: variables ?? {} }),
    });
    const body = (await res.json()) as { data?: T; errors?: Array<{ message: string }>; };
    if (!res.ok || body.errors?.length) {
      const message = body.errors?.map((e) => e.message).join('; ') || `HTTP ${res.status}`;
      throw new Error(`GraphQL error: ${message}`);
    }
    if (!body.data) throw new Error('GraphQL error: empty response');
    return body.data;
  }

  private getWsClient(): Client {
    if (this.wsClient) return this.wsClient;
    const options: ClientOptions = {
      url: this.wsUrl.replace(/^http/, 'ws'),
      webSocketImpl: WebSocket,
      connectionParams: this.authToken ? { headers: { Authorization: `Bearer ${this.authToken}` } } : undefined,
      retryAttempts: 3,
    };
    this.wsClient = createClient(options);
    return this.wsClient;
  }

  public subscribe<T>(query: string, variables: Record<string, unknown>, next: (data: T) => void, error?: (err: unknown) => void): () => void {
    const client = this.getWsClient();
    const dispose = client.subscribe<{ data?: T; errors?: Array<{ message: string }> }>(
      { query, variables },
      {
        next: (payload) => {
          if (payload.errors?.length) {
            error?.(new Error(payload.errors.map((e) => e.message).join('; ')));
            return;
          }
          if (payload.data) next(payload.data as T);
        },
        error: (err) => error?.(err),
        complete: () => undefined,
      },
    );
    return () => dispose();
  }
}


