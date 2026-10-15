import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../../api/http';
import { aTask, deferred, renderStrict } from '../../test-utils';
import type { Task } from '../../api/types';
import { api, liveRegionText, resetApi, waitForList } from './pageTestSetup';
import TaskListPage from './TaskListPage';

vi.mock('../../api/tasksApi');

async function renderWith(tasks: Task[]) {
  api.listTasks.mockResolvedValue(tasks);
  renderStrict(<TaskListPage />);
  await waitForList();
}

describe('TaskListPage — US2 mark as completed', () => {
  beforeEach(() => {
    resetApi();
  });

  it('US2-AS1 (T042): shows "Completed" only after the response, then announces it', async () => {
    const user = userEvent.setup();
    const task = aTask({ title: 'Buy milk' });
    const response = deferred<Task>();
    api.completeTask.mockReturnValue(response.promise);
    await renderWith([task]);

    await user.click(screen.getByRole('button', { name: 'Mark as completed: Buy milk' }));
    expect(screen.queryByText('Completed')).toBeNull();

    response.resolve({ ...task, completed: true });
    await vi.waitFor(() => expect(screen.getByText('Completed')).toBeTruthy());
    const item = screen.getByRole('listitem');
    expect(item.className).toContain('task--completed');
    expect(within(item).queryByRole('button', { name: /mark as completed/i })).toBeNull();
    expect(api.completeTask).toHaveBeenCalledWith(task.id);
    expect(liveRegionText()).toBe('Task marked as completed.');
  });

  it('Edge gone (T050): a 404 removes the task and says it no longer exists', async () => {
    const user = userEvent.setup();
    const task = aTask({ title: 'Buy milk' });
    api.completeTask.mockRejectedValue(new ApiError('problem', 404, '/problems/task-not-found'));
    await renderWith([task, aTask({ title: 'Call Sam' })]);

    await user.click(screen.getByRole('button', { name: 'Mark as completed: Buy milk' }));

    await vi.waitFor(() => expect(screen.queryByText('Buy milk')).toBeNull());
    expect(screen.getByTestId('error-message').textContent).toBe('This task no longer exists.');
    expect(screen.getByText('Call Sam')).toBeTruthy();
  });

  it.each([
    ['500', new ApiError('problem', 500, '/problems/internal')],
    ['503', new ApiError('problem', 503, '/problems/service-unavailable')],
    ['network', new ApiError('network')],
    ['timeout', new ApiError('timeout')],
  ])('FR-014 (T051): a failed complete (%s) shows the message and the task stays not completed', async (_l, failure) => {
    const user = userEvent.setup();
    api.completeTask.mockRejectedValue(failure);
    await renderWith([aTask({ title: 'Buy milk' })]);

    await user.click(screen.getByRole('button', { name: 'Mark as completed: Buy milk' }));

    await vi.waitFor(() =>
      expect(screen.getByTestId('error-message').textContent).toBe('The task was not marked as completed. Try again.'),
    );
    expect(screen.getByText('Not completed')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mark as completed: Buy milk' })).toBeTruthy();
  });

  it('FR-016 (T052): "Mark as completed" works from the keyboard with Enter and with Space', async () => {
    const user = userEvent.setup();
    const milk = aTask({ title: 'Buy milk' });
    const sam = aTask({ title: 'Call Sam' });
    api.completeTask.mockImplementation(async (id: string) => ({ ...(id === milk.id ? milk : sam), completed: true }));
    await renderWith([milk, sam]);

    await user.tab(); // New task
    await user.tab(); // Add
    await user.tab(); // Mark as completed: Buy milk
    expect(document.activeElement?.textContent).toBe('Mark as completed: Buy milk');
    await user.keyboard('{Enter}');
    await vi.waitFor(() => expect(api.completeTask).toHaveBeenCalledWith(milk.id));
    // focus stays on the completed task (its Delete button)
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Delete: Buy milk'));

    await user.tab(); // Mark as completed: Call Sam
    expect(document.activeElement?.textContent).toBe('Mark as completed: Call Sam');
    await user.keyboard(' ');
    await vi.waitFor(() => expect(api.completeTask).toHaveBeenCalledWith(sam.id));
    expect(liveRegionText()).toBe('Task marked as completed.');
  });
});
