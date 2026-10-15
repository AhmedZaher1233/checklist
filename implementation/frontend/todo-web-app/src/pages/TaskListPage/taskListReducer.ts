import type { Task } from '../../api/types';

export type LoadStatus = 'loading' | 'ready' | 'error';

export interface TaskListState {
  status: LoadStatus;
  tasks: Task[];
}

export type TaskListAction =
  | { type: 'loadStarted' }
  | { type: 'loaded'; tasks: Task[] }
  | { type: 'loadFailed' }
  | { type: 'added'; task: Task }
  | { type: 'replaced'; task: Task }
  | { type: 'removed'; id: string };

export const initialState: TaskListState = { status: 'loading', tasks: [] };

/** The screen changes only from confirmed responses (FR-013, FR-014; research R7). */
export function taskListReducer(state: TaskListState, action: TaskListAction): TaskListState {
  switch (action.type) {
    case 'loadStarted':
      return { ...state, status: 'loading' };
    case 'loaded':
      return { status: 'ready', tasks: action.tasks };
    case 'loadFailed':
      return { ...state, status: 'error' };
    case 'added':
      // newest first: a created task goes to the top (FR-005)
      return { ...state, tasks: [action.task, ...state.tasks] };
    case 'replaced':
      // completing keeps the task in place (US2-AS5)
      return { ...state, tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)) };
    case 'removed':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };
  }
}
