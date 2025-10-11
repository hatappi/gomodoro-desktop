import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: string; output: string; }
};

export type CreateTaskInput = {
  title: Scalars['String']['input'];
};

export type Event = {
  __typename?: 'Event';
  eventCategory: EventCategory;
  eventType: EventType;
  payload: EventPayload;
};

export enum EventCategory {
  Pomodoro = 'POMODORO',
  Task = 'TASK'
}

export type EventPayload = EventPomodoroPayload | EventTaskPayload;

export type EventPomodoroPayload = {
  __typename?: 'EventPomodoroPayload';
  elapsedTimeSec: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  phase: PomodoroPhase;
  phaseCount: Scalars['Int']['output'];
  phaseDurationSec: Scalars['Int']['output'];
  remainingTimeSec: Scalars['Int']['output'];
  state: PomodoroState;
  taskId?: Maybe<Scalars['ID']['output']>;
};

export type EventReceivedInput = {
  eventCategory?: InputMaybe<Array<EventCategory>>;
};

export type EventTaskPayload = {
  __typename?: 'EventTaskPayload';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export enum EventType {
  PomodoroCompleted = 'POMODORO_COMPLETED',
  PomodoroPaused = 'POMODORO_PAUSED',
  PomodoroResumed = 'POMODORO_RESUMED',
  PomodoroStarted = 'POMODORO_STARTED',
  PomodoroStopped = 'POMODORO_STOPPED',
  PomodoroTick = 'POMODORO_TICK',
  TaskCreated = 'TASK_CREATED',
  TaskDeleted = 'TASK_DELETED',
  TaskUpdated = 'TASK_UPDATED'
}

export type HealthStatus = {
  __typename?: 'HealthStatus';
  message: Scalars['String']['output'];
  timestamp: Scalars['Time']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTask?: Maybe<Task>;
  deleteTask?: Maybe<Scalars['Boolean']['output']>;
  noop?: Maybe<Scalars['String']['output']>;
  pausePomodoro?: Maybe<Pomodoro>;
  resetPomodoro?: Maybe<Pomodoro>;
  resumePomodoro?: Maybe<Pomodoro>;
  startPomodoro?: Maybe<Pomodoro>;
  stopPomodoro?: Maybe<Pomodoro>;
  updateTask?: Maybe<Task>;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationStartPomodoroArgs = {
  input: StartPomodoroInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Pomodoro = {
  __typename?: 'Pomodoro';
  elapsedTimeSec: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  phase: PomodoroPhase;
  phaseCount: Scalars['Int']['output'];
  phaseDurationSec: Scalars['Int']['output'];
  remainingTimeSec: Scalars['Int']['output'];
  startTime: Scalars['Time']['output'];
  state: PomodoroState;
  taskId: Scalars['ID']['output'];
};

export enum PomodoroPhase {
  LongBreak = 'LONG_BREAK',
  ShortBreak = 'SHORT_BREAK',
  Work = 'WORK'
}

export enum PomodoroState {
  Active = 'ACTIVE',
  Finished = 'FINISHED',
  Paused = 'PAUSED'
}

export type Query = {
  __typename?: 'Query';
  currentPomodoro?: Maybe<Pomodoro>;
  health: HealthStatus;
  noop?: Maybe<Scalars['String']['output']>;
  task?: Maybe<Task>;
  tasks?: Maybe<TaskConnection>;
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};

export type StartPomodoroInput = {
  breakDurationSec: Scalars['Int']['input'];
  longBreakDurationSec: Scalars['Int']['input'];
  taskId: Scalars['ID']['input'];
  workDurationSec: Scalars['Int']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  eventReceived: Event;
  noop?: Maybe<Scalars['String']['output']>;
};


export type SubscriptionEventReceivedArgs = {
  input: EventReceivedInput;
};

export type Task = {
  __typename?: 'Task';
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type TaskConnection = {
  __typename?: 'TaskConnection';
  edges?: Maybe<Array<Maybe<TaskEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TaskEdge = {
  __typename?: 'TaskEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Task>;
};

export type UpdateTaskInput = {
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PomodoroDetailsFragment = { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number };

export type CurrentPomodoroQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentPomodoroQuery = { __typename?: 'Query', currentPomodoro?: { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | null };

export type StartPomodoroMutationVariables = Exact<{
  input: StartPomodoroInput;
}>;


export type StartPomodoroMutation = { __typename?: 'Mutation', startPomodoro?: { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | null };

export type PausePomodoroMutationVariables = Exact<{ [key: string]: never; }>;


export type PausePomodoroMutation = { __typename?: 'Mutation', pausePomodoro?: { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | null };

export type ResumePomodoroMutationVariables = Exact<{ [key: string]: never; }>;


export type ResumePomodoroMutation = { __typename?: 'Mutation', resumePomodoro?: { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | null };

export type StopPomodoroMutationVariables = Exact<{ [key: string]: never; }>;


export type StopPomodoroMutation = { __typename?: 'Mutation', stopPomodoro?: { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | null };

export type ResetPomodoroMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetPomodoroMutation = { __typename?: 'Mutation', resetPomodoro?: { __typename?: 'Pomodoro', id: string, state: PomodoroState, taskId: string, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | null };

export type OnPomodoroEventSubscriptionVariables = Exact<{
  input: EventReceivedInput;
}>;


export type OnPomodoroEventSubscription = { __typename?: 'Subscription', eventReceived: { __typename?: 'Event', eventCategory: EventCategory, eventType: EventType, payload: { __typename?: 'EventPomodoroPayload', id: string, state: PomodoroState, taskId?: string | null, phase: PomodoroPhase, phaseCount: number, phaseDurationSec: number, remainingTimeSec: number, elapsedTimeSec: number } | { __typename?: 'EventTaskPayload' } } };

export type TaskDetailsFragment = { __typename?: 'Task', id: string, title: string, createdAt: string };

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = { __typename?: 'Query', tasks?: { __typename?: 'TaskConnection', totalCount: number, edges?: Array<{ __typename?: 'TaskEdge', cursor: string, node?: { __typename?: 'Task', id: string, title: string, createdAt: string } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } | null };

export type TaskQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TaskQuery = { __typename?: 'Query', task?: { __typename?: 'Task', id: string, title: string, createdAt: string } | null };

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'Task', id: string, title: string, createdAt: string } | null };

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'Task', id: string, title: string, createdAt: string } | null };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: boolean | null };

export const PomodoroDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<PomodoroDetailsFragment, unknown>;
export const TaskDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<TaskDetailsFragment, unknown>;
export const CurrentPomodoroDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentPomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PomodoroDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<CurrentPomodoroQuery, CurrentPomodoroQueryVariables>;
export const StartPomodoroDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartPomodoro"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartPomodoroInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startPomodoro"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PomodoroDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<StartPomodoroMutation, StartPomodoroMutationVariables>;
export const PausePomodoroDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PausePomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pausePomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PomodoroDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<PausePomodoroMutation, PausePomodoroMutationVariables>;
export const ResumePomodoroDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResumePomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resumePomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PomodoroDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<ResumePomodoroMutation, ResumePomodoroMutationVariables>;
export const StopPomodoroDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopPomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopPomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PomodoroDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<StopPomodoroMutation, StopPomodoroMutationVariables>;
export const ResetPomodoroDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPomodoro"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PomodoroDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PomodoroDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pomodoro"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]} as unknown as DocumentNode<ResetPomodoroMutation, ResetPomodoroMutationVariables>;
export const OnPomodoroEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnPomodoroEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventReceivedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventReceived"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventCategory"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"payload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPomodoroPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"phase"}},{"kind":"Field","name":{"kind":"Name","value":"phaseCount"}},{"kind":"Field","name":{"kind":"Name","value":"phaseDurationSec"}},{"kind":"Field","name":{"kind":"Name","value":"remainingTimeSec"}},{"kind":"Field","name":{"kind":"Name","value":"elapsedTimeSec"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OnPomodoroEventSubscription, OnPomodoroEventSubscriptionVariables>;
export const TasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const TaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Task"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<TaskQuery, TaskQueryVariables>;
export const CreateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;