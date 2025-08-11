export type PomodoroState = 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type PomodoroPhase = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

export type Pomodoro = {
  id: string;
  state: PomodoroState;
  taskId: string;
  phase: PomodoroPhase;
  phaseCount: number;
  remainingTimeSec: number;
  elapsedTimeSec: number;
};

export type StartPomodoroParams = {
  workDurationSec: number;
  breakDurationSec: number;
  longBreakDurationSec: number;
  taskId: string;
};

