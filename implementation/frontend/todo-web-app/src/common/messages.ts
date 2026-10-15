/** Texts shown or announced to the user (specs/001-todo-list/research.md, R8). */
export const MESSAGES = {
  noTasks: 'No tasks yet.',
  titleRequired: 'Enter a title for the task.',
  loading: 'Loading tasks…',
  loadFailed: 'The tasks could not be loaded. Try again.',
  addFailed: 'The task was not added. Try again.',
  completeFailed: 'The task was not marked as completed. Try again.',
  deleteFailed: 'The task was not deleted. Try again.',
  taskGone: 'This task no longer exists.',
  added: 'Task added.',
  completed: 'Task marked as completed.',
  deleted: 'Task deleted.',
} as const;

/** Maximum title length; the browser counts UTF-16 code units, as the Task Service does (research R1). */
export const MAX_TITLE_LENGTH = 100;
