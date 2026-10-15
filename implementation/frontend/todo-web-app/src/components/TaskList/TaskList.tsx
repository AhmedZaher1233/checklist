import type { Task } from '../../api/types';
import { MESSAGES } from '../../common/messages';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  busyIds: ReadonlySet<string>;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  registerDeleteButton: (id: string, element: HTMLButtonElement | null) => void;
}

/** The shared list, newest first as the Task Service returns it; "No tasks yet." when empty. */
export default function TaskList({ tasks, busyIds, onComplete, onDelete, registerDeleteButton }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="empty-message" data-testid="empty-message">
        {MESSAGES.noTasks}
      </p>
    );
  }
  return (
    <ul className="task-list" aria-label="Tasks" data-testid="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          busy={busyIds.has(task.id)}
          onComplete={onComplete}
          onDelete={onDelete}
          registerDeleteButton={registerDeleteButton}
        />
      ))}
    </ul>
  );
}
