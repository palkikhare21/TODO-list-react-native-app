import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { taskApi } from '../api/taskApi';
import { CreateTaskInput, Task } from '../types/task';
import { smartSortTasks } from '../utils/taskSort';

type TaskFilter = 'all' | 'pending' | 'completed';

type TaskContextValue = {
  tasks: Task[];
  filter: TaskFilter;
  loading: boolean;
  setFilter: (filter: TaskFilter) => void;
  loadTasks: () => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [rawTasks, setRawTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(false);

  const tasks = useMemo(() => {
    const filtered = rawTasks.filter(task => {
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
    return smartSortTasks(filtered);
  }, [rawTasks, filter]);

  async function loadTasks() {
    setLoading(true);
    try {
      setRawTasks(await taskApi.list());
    } finally {
      setLoading(false);
    }
  }

  async function createTask(task: CreateTaskInput) {
    const created = await taskApi.create(task);
    setRawTasks(current => [created, ...current]);
  }

  async function toggleTask(id: string) {
    const updated = await taskApi.toggleComplete(id);
    setRawTasks(current => current.map(task => (task._id === id ? updated : task)));
  }

  async function deleteTask(id: string) {
    await taskApi.remove(id);
    setRawTasks(current => current.filter(task => task._id !== id));
  }

  return (
    <TaskContext.Provider value={{ tasks, filter, loading, setFilter, loadTasks, createTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider');
  }
  return context;
}
