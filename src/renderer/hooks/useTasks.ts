import { useState, useEffect, useCallback } from 'react';
import { Task } from '../../shared/types/gomodoro';

type UseTasksReturn = {
  tasks: Task[];
  selectedTaskId: string | null;
  loading: boolean;
  error: string | null;
  selectTask: (taskId: string | null) => void;
  createTask: (title: string) => Promise<void>;
  updateTask: (taskId: string, title: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tasks = await window.electronAPI.listTasks();
      setTasks(tasks);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (title: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.createTask({ title });
      await refreshTasks();
    } catch (err) {
      setError('Failed to create task');
      console.error('Failed to create task:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshTasks]);

  const updateTask = useCallback(async (taskId: string, title: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.updateTask({ taskId, title });
      await refreshTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error('Failed to update task:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.deleteTask({ taskId });
      await refreshTasks();
      // If deleted task was selected, deselect it
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error('Failed to delete task:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshTasks, selectedTaskId]);

  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  return {
    tasks,
    selectedTaskId,
    loading,
    error,
    selectTask,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
}