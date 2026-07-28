import { CreateTaskInput, Task } from '../types/task';
import { apiRequest } from './client';

export const taskApi = {
  list: () => apiRequest<Task[]>('/tasks', { auth: true }),
  create: (task: CreateTaskInput) => apiRequest<Task>('/tasks', { method: 'POST', body: task, auth: true }),
  toggleComplete: (id: string) => apiRequest<Task>(`/tasks/${id}/complete`, { method: 'PATCH', auth: true }),
  remove: (id: string) => apiRequest<{ deleted: boolean }>(`/tasks/${id}`, { method: 'DELETE', auth: true }),
};
