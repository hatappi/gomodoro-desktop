import { useEffect, useMemo, useState } from "react";
import type { Pomodoro } from "../../shared/types/gomodoro";

export type UsePomodoroResult = {
  pomodoro: Pomodoro | null;
  isLoading: boolean;
  error: string | null;
  start: (taskId?: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
};

export function usePomodoro(): UsePomodoroResult {
  const [pomodoro, setPomodoro] = useState<Pomodoro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch current state from main via preload bridge
  useEffect(() => {
    let mounted = true;
    // subscribe to realtime events
    const off = window.electronAPI.onPomodoroEvent((payload) => {
      setPomodoro(payload);
    });

    (async () => {
      try {
        setIsLoading(true);
        const current = await window.electronAPI.getCurrentPomodoro();
        if (mounted) setPomodoro(current);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
      off();
    };
  }, []);

  const start = async (taskId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, use fixed durations; these could come from settings later
      const input = {
        workDurationSec: 1500,
        breakDurationSec: 300,
        longBreakDurationSec: 900,
        taskId: taskId ?? "default-task",
      };
      await window.electronAPI.startPomodoro(input);
      const current = await window.electronAPI.getCurrentPomodoro();
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
      const current = await window.electronAPI.getCurrentPomodoro();
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
      const current = await window.electronAPI.getCurrentPomodoro();
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
      const current = await window.electronAPI.getCurrentPomodoro();
      setPomodoro(current);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return useMemo(
    () => ({ pomodoro, isLoading, error, start, pause, resume, stop }),
    [pomodoro, isLoading, error],
  );
}
