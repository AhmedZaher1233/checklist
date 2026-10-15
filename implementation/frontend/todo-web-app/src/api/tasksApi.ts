import { request } from './http';
import type { Task } from './types';

const TASKS = '/api/v1/tasks';

export function listTasks(signal?: AbortSignal): Promise<Task[]> {
  return request<Task[]>(TASKS, { signal });
}

export function createTask(title: string): Promise<Task> {
  return request<Task>(TASKS, { method: 'POST', body: { title } });
}

export function completeTask(id: string): Promise<Task> {
  return request<Task>(`${TASKS}/${encodeURIComponent(id)}`, { method: 'PATCH', body: { completed: true } });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`${TASKS}/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
