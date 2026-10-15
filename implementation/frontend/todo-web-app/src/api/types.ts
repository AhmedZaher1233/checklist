/** A task as the Task Service returns it (specs/001-todo-list/contracts/task-service.openapi.yaml). */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  /** ISO 8601 UTC instant */
  createdAt: string;
}
