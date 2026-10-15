// prerequest/TaskPreRequest.ts — provisioning through the Task Service's public API
// (contract: specs/001-todo-list/contracts/task-service.openapi.yaml). No UI here.
//
// - [D1] empty task list: emptyTaskList() deletes every task — LOCAL ENVIRONMENT ONLY (constitution QC-7;
//   authorised by the QC for phase 1 on 2026-10-13). It refuses any other host.
// - Cleanup of [D2]: deleteTasksWithPrefix() deletes only the tasks whose title starts with the case's
//   own run prefix (owned data only, after the evidence image).
import type { APIRequestContext } from '@playwright/test';
import { environment } from '../helpers/test-data';

const TASKS = '/api/v1/tasks';

export type ApiTask = { id: string; title: string; completed: boolean; createdAt: string };

export async function listTasks(request: APIRequestContext): Promise<ApiTask[]> {
  const response = await request.get(TASKS);
  if (!response.ok()) throw new Error(`listTasks: HTTP ${response.status()}`);
  return (await response.json()) as ApiTask[];
}

export async function deleteTask(request: APIRequestContext, id: string): Promise<void> {
  const response = await request.delete(`${TASKS}/${encodeURIComponent(id)}`);
  // 404 = already gone (for example deleted by the case itself) — the end state is what cleanup needs
  if (!response.ok() && response.status() !== 404) throw new Error(`deleteTask: HTTP ${response.status()}`);
}

/** Owned data only: every task whose title starts with `prefix`. Idempotent. */
export async function deleteTasksWithPrefix(request: APIRequestContext, prefix: string): Promise<number> {
  const owned = (await listTasks(request)).filter((task) => task.title.startsWith(prefix));
  for (const task of owned) await deleteTask(request, task.id);
  return owned.length;
}

/** [D1] — the shared list holds 0 tasks. Local environment only; idempotent; verified after deleting. */
export async function emptyTaskList(request: APIRequestContext): Promise<void> {
  const host = new URL(environment('E1').url).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(host)) {
    throw new Error(`emptyTaskList: refused — [E1] host "${host}" is not the local environment (constitution QC-7)`);
  }
  for (const task of await listTasks(request)) await deleteTask(request, task.id);
  const left = (await listTasks(request)).length;
  if (left !== 0) throw new Error(`emptyTaskList: ${left} task(s) still listed after the delete sweep`);
}
