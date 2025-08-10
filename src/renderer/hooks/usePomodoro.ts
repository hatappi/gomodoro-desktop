import { useEffect, useMemo, useRef, useState } from 'react';

export type PomodoroState = 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type PomodoroPhase = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

export type Pomodoro = {
  id: string;
  state: PomodoroState;
  taskId: string | null;
  startTime: string;
  phase: PomodoroPhase;
  phaseCount: number;
  remainingTimeSec: number;
  elapsedTimeSec: number;
};

export type UsePomodoroResult = {
  pomodoro: Pomodoro | null;
  isLoading: boolean;
  error: string | null;
  start: (taskId?: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
};

const nowIso = () => new Date().toISOString();

export function usePomodoro(): UsePomodoroResult {
  const [pomodoro, setPomodoro] = useState<Pomodoro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initial fetch current state from main via preload bridge
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const current = (await window.electronAPI.getCurrentPomodoro()) as Pomodoro | null;
        if (mounted) setPomodoro(current);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Tick timer when ACTIVE (optimistic local tick based on remainingTimeSec)
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (pomodoro?.state === 'ACTIVE' && pomodoro.remainingTimeSec > 0) {
      timerRef.current = window.setInterval(() => {
        setPomodoro((prev) => {
          if (!prev) return prev;
          const remaining = Math.max(0, prev.remainingTimeSec - 1);
          const elapsed = prev.elapsedTimeSec + 1;
          const next: Pomodoro = { ...prev, remainingTimeSec: remaining, elapsedTimeSec: elapsed };
          if (remaining === 0) {
            next.state = 'FINISHED';
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pomodoro?.state, pomodoro?.remainingTimeSec]);

  const start = async (taskId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, use fixed durations; these could come from settings later
      const input = {
        workDurationSec: 1500,
        breakDurationSec: 300,
        longBreakDurationSec: 900,
        taskId: taskId ?? 'default-task',
      };
      await window.electronAPI.startPomodoro(input);
      const current = (await window.electronAPI.getCurrentPomodoro()) as Pomodoro | null;
      setPomodoro(current);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const pause = async () => {
    if (!pomodoro) return;
    setIsLoading(true);
    setError(null);
    try {
      await window.electronAPI.pausePomodoro();
      const current = (await window.electronAPI.getCurrentPomodoro()) as Pomodoro | null;
      setPomodoro(current);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const resume = async () => {
    if (!pomodoro) return;
    setIsLoading(true);
    setError(null);
    try {
      await window.electronAPI.resumePomodoro();
      const current = (await window.electronAPI.getCurrentPomodoro()) as Pomodoro | null;
      setPomodoro(current);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const stop = async () => {
    if (!pomodoro) return;
    setIsLoading(true);
    setError(null);
    try {
      await window.electronAPI.stopPomodoro();
      const current = (await window.electronAPI.getCurrentPomodoro()) as Pomodoro | null;
      setPomodoro(current);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return useMemo(
    () => ({ pomodoro, isLoading, error, start, pause, resume, stop }),
    [pomodoro, isLoading, error]
  );
}


