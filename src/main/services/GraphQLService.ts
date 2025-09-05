import { setTimeout as delay } from 'node:timers/promises';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  NormalizedCacheObject,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type GraphQLServiceOptions = {
  httpUrl: string;
  wsUrl: string;
  authToken?: string;
};

export class GraphQLService {
  private readonly httpUrl: string;
  private readonly wsUrl: string;
  private readonly authToken?: string;
  private apollo: ApolloClient<NormalizedCacheObject>;

  constructor(options: GraphQLServiceOptions) {
    this.httpUrl = options.httpUrl;
    this.wsUrl = options.wsUrl;
    this.authToken = options.authToken;
    this.apollo = this.createApolloClient();
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

  private createApolloClient(): ApolloClient<NormalizedCacheObject> {
    const httpLink = new HttpLink({
      uri: this.httpUrl,
      fetch: (globalThis as any).fetch,
      headers: this.authToken ? { Authorization: `Bearer ${this.authToken}` } : undefined,
    });

    const wsLink = new GraphQLWsLink(
      createClient({
        url: this.wsUrl.startsWith('ws') ? this.wsUrl : this.wsUrl.replace(/^http/, 'ws'),
        webSocketImpl: WebSocket,
        connectionParams: this.authToken ? { headers: { Authorization: `Bearer ${this.authToken}` } } : undefined,
        retryAttempts: 3,
      }),
    );

    const link = split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === 'OperationDefinition' && def.operation === 'subscription';
      },
      wsLink,
      httpLink,
    );

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      connectToDevTools: false,
      defaultOptions: {
        query: { fetchPolicy: 'no-cache' },
        watchQuery: { fetchPolicy: 'no-cache' }
      }
    });
  }

  public async query<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    document: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
  ): Promise<TData> {
    const res = await this.apollo.query({ query: document, variables: variables as any });
    return res.data;
  }

  public async mutate<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    document: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
  ): Promise<TData> {
    const res = await this.apollo.mutate({ mutation: document, variables: variables as any });
    if (!res.data) throw new Error('Empty mutation response');
    return res.data;
  }

  public subscribe<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    document: TypedDocumentNode<TData, TVariables>,
    variables: TVariables,
    next: (data: TData) => void,
    error?: (err: unknown) => void,
  ): () => void {
    const sub = this.apollo.subscribe({ query: document, variables: variables as any }).subscribe({
      next: (payload) => next(payload.data as TData),
      error: (err) => error?.(err),
    });
    return () => sub.unsubscribe();
  }
}


