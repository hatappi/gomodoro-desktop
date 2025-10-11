import { GraphQLService } from "./GraphQLService";
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
  ResetPomodoroDocument,
  type ResetPomodoroMutation,
  OnPomodoroEventDocument,
  type OnPomodoroEventSubscription,
  type OnPomodoroEventSubscriptionVariables,
  TasksDocument,
  type TasksQuery,
  type TasksQueryVariables,
  CreateTaskDocument,
  type CreateTaskMutation,
  type CreateTaskMutationVariables,
  UpdateTaskDocument,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
  DeleteTaskDocument,
  type DeleteTaskMutation,
  type DeleteTaskMutationVariables,
  EventCategory,
} from "../../shared/graphql/generated";
import type {
  Pomodoro,
  StartPomodoroParams,
  Task,
} from "../../shared/types/gomodoro";

export default class PomodoroService {
  constructor(private readonly gql: GraphQLService) {}

  public async getCurrentPomodoro(): Promise<Pomodoro | null> {
    const data = await this.gql.query<
      CurrentPomodoroQuery,
      CurrentPomodoroQueryVariables
    >(CurrentPomodoroDocument, {} as CurrentPomodoroQueryVariables);
    const p = data.currentPomodoro;
    return p
      ? {
          id: p.id,
          state: p.state,
          taskId: p.taskId,
          phase: p.phase,
          phaseCount: p.phaseCount,
          phaseDurationSec: p.phaseDurationSec,
          remainingTimeSec: p.remainingTimeSec,
          elapsedTimeSec: p.elapsedTimeSec,
        }
      : null;
  }

  public async startPomodoro(input: StartPomodoroParams): Promise<Pomodoro> {
    const data = await this.gql.mutate<
      StartPomodoroMutation,
      StartPomodoroMutationVariables
    >(StartPomodoroDocument, { input });
    const p = data.startPomodoro;
    if (!p)
      throw new Error("Failed to start pomodoro. started pomodoro not found.");

    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      phaseDurationSec: p.phaseDurationSec,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async pausePomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<
      PausePomodoroMutation,
      Record<string, never>
    >(PausePomodoroDocument, {} as Record<string, never>);
    const p = data.pausePomodoro;
    if (!p)
      throw new Error("Failed to pause pomodoro. paused pomodoro not found.");
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      phaseDurationSec: p.phaseDurationSec,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async resumePomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<
      ResumePomodoroMutation,
      Record<string, never>
    >(ResumePomodoroDocument, {} as Record<string, never>);
    const p = data.resumePomodoro;
    if (!p)
      throw new Error("Failed to resume pomodoro. resumed pomodoro not found.");
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      phaseDurationSec: p.phaseDurationSec,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async stopPomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<
      StopPomodoroMutation,
      Record<string, never>
    >(StopPomodoroDocument, {} as Record<string, never>);
    const p = data.stopPomodoro;
    if (!p)
      throw new Error("Failed to stop pomodoro. stopped pomodoro not found.");
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      phaseDurationSec: p.phaseDurationSec,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public async resetPomodoro(): Promise<Pomodoro> {
    const data = await this.gql.mutate<
      ResetPomodoroMutation,
      Record<string, never>
    >(ResetPomodoroDocument, {} as Record<string, never>);
    const p = data.resetPomodoro;
    if (!p)
      throw new Error("Failed to reset pomodoro. reset pomodoro not found.");
    return {
      id: p.id,
      state: p.state,
      taskId: p.taskId,
      phase: p.phase,
      phaseCount: p.phaseCount,
      phaseDurationSec: p.phaseDurationSec,
      remainingTimeSec: p.remainingTimeSec,
      elapsedTimeSec: p.elapsedTimeSec,
    };
  }

  public subscribePomodoroEvents(
    onEvent: (p: Pomodoro) => void,
    onError?: (err: unknown) => void,
  ): () => void {
    const variables: OnPomodoroEventSubscriptionVariables = {
      input: { eventCategory: [EventCategory.Pomodoro] },
    };
    return this.gql.subscribe<
      OnPomodoroEventSubscription,
      OnPomodoroEventSubscriptionVariables
    >(
      OnPomodoroEventDocument,
      variables,
      (data) => {
        const payload = data.eventReceived?.payload;
        if (!payload) {
          onError?.("Failed to get payload. payload not found.");
          return;
        }

        if (payload.__typename !== "EventPomodoroPayload") {
          onError?.("Failed to get payload. payload is not a pomodoro event.");
          return;
        }

        const p = payload as {
          id: string;
          state: Pomodoro["state"];
          taskId?: string | null;
          phase: Pomodoro["phase"];
          phaseCount: number;
          phaseDurationSec: number;
          remainingTimeSec: number;
          elapsedTimeSec: number;
        };
        onEvent({
          id: p.id,
          state: p.state,
          taskId: p.taskId ?? "",
          phase: p.phase,
          phaseCount: p.phaseCount,
          phaseDurationSec: p.phaseDurationSec,
          remainingTimeSec: p.remainingTimeSec,
          elapsedTimeSec: p.elapsedTimeSec,
        });
      },
      onError,
    );
  }

  // Task management methods
  public async listTasks(): Promise<Task[]> {
    const data = await this.gql.query<TasksQuery, TasksQueryVariables>(
      TasksDocument,
      {},
    );

    // Note: GraphQL schema doesn't support pagination parameters, so we get all available tasks
    // If pagination is needed in the future, the server-side schema would need to be updated
    const tasks =
      data.tasks?.edges
        ?.filter((edge): edge is NonNullable<typeof edge> => edge !== null)
        .map((edge) => edge.node)
        .filter((node): node is Task => node !== null) || [];

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      createdAt: task.createdAt,
    }));
  }

  public async createTask(input: { title: string }): Promise<Task> {
    const data = await this.gql.mutate<
      CreateTaskMutation,
      CreateTaskMutationVariables
    >(CreateTaskDocument, {
      input: { title: input.title },
    });
    const task = data.createTask;
    if (!task)
      throw new Error("Failed to create task. created task not found.");
    return {
      id: task.id,
      title: task.title,
      createdAt: task.createdAt,
    };
  }

  public async updateTask(input: { id: string; title: string }): Promise<Task> {
    const data = await this.gql.mutate<
      UpdateTaskMutation,
      UpdateTaskMutationVariables
    >(UpdateTaskDocument, {
      input: { id: input.id, title: input.title },
    });
    const task = data.updateTask;
    if (!task)
      throw new Error("Failed to update task. updated task not found.");
    return {
      id: task.id,
      title: task.title,
      createdAt: task.createdAt,
    };
  }

  public async deleteTask(taskId: string): Promise<boolean> {
    const data = await this.gql.mutate<
      DeleteTaskMutation,
      DeleteTaskMutationVariables
    >(DeleteTaskDocument, {
      id: taskId,
    });
    return data.deleteTask || false;
  }
}
