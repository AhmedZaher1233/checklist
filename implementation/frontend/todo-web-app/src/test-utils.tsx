import { StrictMode } from 'react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import type { Task } from './api/types';

let sequence = 0;

/** A task as the Task Service would return it. */
export function aTask(overrides: Partial<Task> = {}): Task {
  sequence += 1;
  return {
    id: `00000000-0000-4000-8000-${String(sequence).padStart(12, '0')}`,
    title: `Task ${sequence}`,
    completed: false,
    createdAt: new Date(Date.UTC(2026, 9, 13, 8, sequence)).toISOString(),
    ...overrides,
  };
}

/** A promise the test resolves or rejects when it chooses. */
export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Renders the way main.tsx does, inside StrictMode. */
export function renderStrict(element: ReactElement) {
  return render(<StrictMode>{element}</StrictMode>);
}
