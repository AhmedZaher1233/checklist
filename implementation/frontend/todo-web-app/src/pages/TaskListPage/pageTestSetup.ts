import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import * as tasksApi from '../../api/tasksApi';

/** The mocked API module; each test file calls vi.mock('../../api/tasksApi') first. */
export const api = vi.mocked(tasksApi);

export function resetApi() {
  api.listTasks.mockReset();
  api.createTask.mockReset();
  api.completeTask.mockReset();
  api.deleteTask.mockReset();
}

/** The polite live region's current text. */
export function liveRegionText(): string {
  return screen.getByRole('status').textContent ?? '';
}

/** Waits for the two-step load: the indicator clears and the list (or empty message) is ready. */
export async function waitForList() {
  await vi.waitFor(() => {
    if (screen.queryByTestId('loading-indicator')) {
      throw new Error('still loading');
    }
  });
}
