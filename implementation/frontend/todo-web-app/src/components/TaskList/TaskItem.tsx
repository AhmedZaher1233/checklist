import type { Task } from '../../api/types';

interface TaskItemProps {
  task: Task;
  busy: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  registerDeleteButton: (id: string, element: HTMLButtonElement | null) => void;
}

/**
 * One task: its title as text, its state, and its actions. A completed task offers no way back (FR-009).
 * Button names keep the visible label first so speech input works ("Delete: Buy milk").
 */
export default function TaskItem({ task, busy, onComplete, onDelete, registerDeleteButton }: TaskItemProps) {
  return (
    <li className={task.completed ? 'task task--completed' : 'task'} data-testid={`task-item-${task.id}`}>
      <span className="task__title" data-testid="task-title">
        {task.title}
      </span>
      {task.completed ? (
        <span className="task__state" data-testid="task-state">
          Completed
        </span>
      ) : (
        <span className="sr-only" data-testid="task-state">
          Not completed
        </span>
      )}
      <span className="task__actions">
        {!task.completed && (
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            disabled={busy}
            data-testid={`task-complete-${task.id}`}
          >
            Mark as completed<span className="sr-only">: {task.title}</span>
          </button>
        )}
        <button
          type="button"
          ref={(element) => registerDeleteButton(task.id, element)}
          onClick={() => onDelete(task.id)}
          disabled={busy}
          data-testid={`task-delete-${task.id}`}
        >
          Delete<span className="sr-only">: {task.title}</span>
        </button>
      </span>
    </li>
  );
}
