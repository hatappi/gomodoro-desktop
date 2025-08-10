import { GraphQLService } from './GraphQLService';
import {
  CurrentPomodoroDocument,
  type CurrentPomodoroQuery,
  type CurrentPomodoroQueryVariables,
  StartPomodoroDocument,
  type StartPomodoroMutation,
  type StartPomodoroMutationVariables,
  PausePomodoroDocument,
  type PausePomodoroMutation,
  ResumePomodoroDocument,
  type ResumePomodoroMutation,
  StopPomodoroDocument,
  type StopPomodoroMutation,
  OnPomodoroEventDocument,
  type OnPomodoroEventSubscription,
  type OnPomodoroEventSubscriptionVariables,
} from '../../shared/graphql/generated';

export type GqlPomodoroState = 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type GqlPomodoroPhase = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

export type Pomodoro = {
  id: string;
  state: GqlPomodoroState;
  taskId: string;
  startTime: string; // RFC3339
  phase: GqlPomodoroPhase;
  phaseCount: number;
  remainingTimeSec: number;
  elapsedTimeSec: number;
};

export type StartPomodoroInput = {
  workDurationSec: number;
  breakDurationSec: number;
  longBreakDurationSec: number;
  taskId: string;
};

export default class PomodoroService {
  constructor(private readonly gql: GraphQLService) {}

  public async getCurrentPomodoro(): Promise<Pomodoro | null> {
    const data = await this.gql.query<CurrentPomodoroQuery, CurrentPomodoroQueryVariables>(CurrentPomodoroDocument, {} as CurrentPomodoroQueryVariables);
    return (data.currentPomodoro as unknown as Pomodoro) ?? null;
  }

  public async startPomodoro(input: StartPomodoroInput): Promise<Pomodoro> {
    const data = await this.gql.mutate<StartPomodoroMutation, StartPomodoroMutationVariables>(StartPomodoroDocument, { input });
    return data.startPomodoro as unknown as Pomodoro;
  }

  public async pausePomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<PausePomodoroMutation, Record<string, never>>(PausePomodoroDocument, {} as Record<string, never>);
    return data.pausePomodoro as unknown as Pomodoro;
  }

  public async resumePomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<ResumePomodoroMutation, Record<string, never>>(ResumePomodoroDocument, {} as Record<string, never>);
    return data.resumePomodoro as unknown as Pomodoro;
  }

  public async stopPomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<StopPomodoroMutation, Record<string, never>>(StopPomodoroDocument, {} as Record<string, never>);
    return data.stopPomodoro as unknown as Pomodoro;
  }

  public subscribePomodoroEvents(
    onEvent: (p: Pomodoro) => void,
    onError?: (err: unknown) => void,
  ): () => void {
    const variables: OnPomodoroEventSubscriptionVariables = { input: { eventCategory: ['POMODORO' as any] } };
    return this.gql.subscribe<OnPomodoroEventSubscription, OnPomodoroEventSubscriptionVariables>(
      OnPomodoroEventDocument,
      variables,
      (data) => {
        const payload = data.eventReceived?.payload as any;
        if (payload && 'remainingTimeSec' in payload) {
          onEvent(payload as Pomodoro);
        }
      },
      onError,
    );
  }
}


