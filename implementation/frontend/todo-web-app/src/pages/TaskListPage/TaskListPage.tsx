import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { ApiError, isAborted, isNotFound } from '../../api/http';
import { completeTask, createTask, deleteTask, listTasks } from '../../api/tasksApi';
import { MESSAGES } from '../../common/messages';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import TaskForm from '../../components/TaskForm/TaskForm';
import type { AddResult } from '../../components/TaskForm/TaskForm';
import TaskList from '../../components/TaskList/TaskList';
import { initialState, taskListReducer } from './taskListReducer';

type FocusTarget = { kind: 'delete'; id: string } | { kind: 'input' } | null;

/** The single screen of the To-Do List: load, add, complete and delete (spec 001). */
export default function TaskListPage() {
  const [state, dispatch] = useReducer(taskListReducer, initialState);
  const [reloadCount, setReloadCount] = useState(0);
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [focusTarget, setFocusTarget] = useState<FocusTarget>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteButtons = useRef(new Map<string, HTMLButtonElement>());

  const announce = useCallback((message: string) => setAnnouncement(message), []);

  const fail = useCallback((message: string) => {
    setError(message);
    setAnnouncement(message);
  }, []);

  // Load once per mount (and on "Try again"); the abort makes StrictMode's double effect harmless (research R7).
  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'loadStarted' });
    setAnnouncement(MESSAGES.loading);
    listTasks(controller.signal)
      .then((tasks) => {
        dispatch({ type: 'loaded', tasks });
        setAnnouncement('');
      })
      .catch((cause: unknown) => {
        if (isAborted(cause)) {
          return;
        }
        dispatch({ type: 'loadFailed' });
        setAnnouncement(MESSAGES.loadFailed);
      });
    return () => controller.abort();
  }, [reloadCount]);

  useEffect(() => {
    if (!focusTarget) {
      return;
    }
    const element =
      focusTarget.kind === 'delete' ? deleteButtons.current.get(focusTarget.id) : inputRef.current;
    (element ?? inputRef.current)?.focus();
    setFocusTarget(null);
  }, [focusTarget, state.tasks]);

  const setBusy = (id: string, busy: boolean) =>
    setBusyIds((current) => {
      const next = new Set(current);
      if (busy) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });

  const registerDeleteButton = useCallback((id: string, element: HTMLButtonElement | null) => {
    if (element) {
      deleteButtons.current.set(id, element);
    } else {
      deleteButtons.current.delete(id);
    }
  }, []);

  /** Where focus goes after a task leaves the list: next item, else previous, else the input. */
  const focusAfterRemoving = (id: string) => {
    const index = state.tasks.findIndex((task) => task.id === id);
    const neighbour = state.tasks[index + 1] ?? state.tasks[index - 1];
    setFocusTarget(neighbour ? { kind: 'delete', id: neighbour.id } : { kind: 'input' });
  };

  const removeGoneTask = (id: string) => {
    focusAfterRemoving(id);
    dispatch({ type: 'removed', id });
    fail(MESSAGES.taskGone);
  };

  const handleAdd = async (title: string): Promise<AddResult> => {
    setError(null);
    try {
      const task = await createTask(title);
      dispatch({ type: 'added', task });
      announce(MESSAGES.added);
      return 'ok';
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 400 && cause.fieldErrors.some((e) => e.code === 'required')) {
        return 'invalid';
      }
      fail(MESSAGES.addFailed);
      return 'failed';
    }
  };

  const handleComplete = async (id: string) => {
    setError(null);
    setBusy(id, true);
    try {
      const task = await completeTask(id);
      dispatch({ type: 'replaced', task });
      // the "Mark as completed" button is gone; keep focus on this task
      setFocusTarget({ kind: 'delete', id });
      announce(MESSAGES.completed);
    } catch (cause) {
      if (isNotFound(cause)) {
        removeGoneTask(id);
      } else {
        fail(MESSAGES.completeFailed);
      }
    } finally {
      setBusy(id, false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setBusy(id, true);
    try {
      await deleteTask(id);
      focusAfterRemoving(id);
      dispatch({ type: 'removed', id });
      announce(MESSAGES.deleted);
    } catch (cause) {
      if (isNotFound(cause)) {
        removeGoneTask(id);
      } else {
        fail(MESSAGES.deleteFailed);
      }
    } finally {
      setBusy(id, false);
    }
  };

  return (
    <main className="page">
      <h1>To-Do List</h1>
      <TaskForm onAdd={handleAdd} onInvalid={announce} inputRef={inputRef} />
      <StatusMessage announcement={announcement} error={error} />
      {state.status === 'loading' && (
        <p className="loading" data-testid="loading-indicator">
          {MESSAGES.loading}
        </p>
      )}
      {state.status === 'error' && (
        <div className="load-error">
          <p data-testid="load-error">{MESSAGES.loadFailed}</p>
          <button type="button" onClick={() => setReloadCount((count) => count + 1)} data-testid="retry-button">
            Try again
          </button>
        </div>
      )}
      {state.status === 'ready' && (
        <TaskList
          tasks={state.tasks}
          busyIds={busyIds}
          onComplete={handleComplete}
          onDelete={handleDelete}
          registerDeleteButton={registerDeleteButton}
        />
      )}
    </main>
  );
}
