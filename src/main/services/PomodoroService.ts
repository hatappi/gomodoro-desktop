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
import type { Pomodoro, StartPomodoroParams } from '../../shared/types/gomodoro';

export default class PomodoroService {
  constructor(private readonly gql: GraphQLService) {}

  public async getCurrentPomodoro(): Promise<Pomodoro | null> {
    const data = await this.gql.query<CurrentPomodoroQuery, CurrentPomodoroQueryVariables>(CurrentPomodoroDocument, {} as CurrentPomodoroQueryVariables);
    const p = data.currentPomodoro;
    return p
      ? {
          id: p.id,
          state: p.state,
          taskId: p.taskId,
          phase: p.phase,
          phaseCount: p.phaseCount,
          remainingTimeSec: p.remainingTimeSec,
          elapsedTimeSec: p.elapsedTimeSec,
        }
      : null;
  }

  public async startPomodoro(input: StartPomodoroParams): Promise<Pomodoro> {
    const data = await this.gql.mutate<StartPomodoroMutation, StartPomodoroMutationVariables>(StartPomodoroDocument, { input });
    const p = data.startPomodoro!;
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async pausePomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<PausePomodoroMutation, Record<string, never>>(PausePomodoroDocument, {} as Record<string, never>);
    const p = data.pausePomodoro!;
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async resumePomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<ResumePomodoroMutation, Record<string, never>>(ResumePomodoroDocument, {} as Record<string, never>);
    const p = data.resumePomodoro!;
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async stopPomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<StopPomodoroMutation, Record<string, never>>(StopPomodoroDocument, {} as Record<string, never>);
    const p = data.stopPomodoro!;
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
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
          const p = payload as { id: string; state: Pomodoro['state']; taskId?: string | null; phase: Pomodoro['phase']; phaseCount: number; remainingTimeSec: number; elapsedTimeSec: number };
          onEvent({
            id: p.id,
            state: p.state,
            taskId: p.taskId ?? '',
            phase: p.phase,
            phaseCount: p.phaseCount,
            remainingTimeSec: p.remainingTimeSec,
            elapsedTimeSec: p.elapsedTimeSec,
          });
        }
      },
      onError,
    );
  }
}


