import { GraphQLService } from './GraphQLService';

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
    const query = `
      query CurrentPomodoro {
        currentPomodoro {
          id
          state
          taskId
          startTime
          phase
          phaseCount
          remainingTimeSec
          elapsedTimeSec
        }
      }
    `;
    const data = await this.gql.execute<{ currentPomodoro: Pomodoro | null }>(query);
    return data.currentPomodoro ?? null;
  }

  public async startPomodoro(input: StartPomodoroInput): Promise<Pomodoro> {
    const query = `
      mutation StartPomodoro($input: StartPomodoroInput!) {
        startPomodoro(input: $input) {
          id
          state
          taskId
          startTime
          phase
          phaseCount
          remainingTimeSec
          elapsedTimeSec
        }
      }
    `;
    const data = await this.gql.execute<{ startPomodoro: Pomodoro }>(query, { input });
    return data.startPomodoro;
  }

  public async pausePomodoro(): Promise<Pomodoro> {
    const query = `
      mutation { 
        pausePomodoro {
          id
          state
          taskId
          startTime
          phase
          phaseCount
          remainingTimeSec
          elapsedTimeSec
        }
      }
    `;
    const data = await this.gql.execute<{ pausePomodoro: Pomodoro }>(query);
    return data.pausePomodoro;
  }

  public async resumePomodoro(): Promise<Pomodoro> {
    const query = `
      mutation { 
        resumePomodoro {
          id
          state
          taskId
          startTime
          phase
          phaseCount
          remainingTimeSec
          elapsedTimeSec
        }
      }
    `;
    const data = await this.gql.execute<{ resumePomodoro: Pomodoro }>(query);
    return data.resumePomodoro;
  }

  public async stopPomodoro(): Promise<Pomodoro> {
    const query = `
      mutation { 
        stopPomodoro {
          id
          state
          taskId
          startTime
          phase
          phaseCount
          remainingTimeSec
          elapsedTimeSec
        }
      }
    `;
    const data = await this.gql.execute<{ stopPomodoro: Pomodoro }>(query);
    return data.stopPomodoro;
  }
}


