import { screen } from '@testing-library/react';
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

describe('TaskListPage — US3 delete', () => {
  beforeEach(() => {
    resetApi();
  });

  it('US3-AS1 (T061): removes the task after the response, with no confirmation, and moves focus', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const pay = aTask({ title: 'Pay rent' });
    const milk = aTask({ title: 'Buy milk' });
    const sam = aTask({ title: 'Call Sam' });
    const response = deferred<void>();
    api.deleteTask.mockReturnValueOnce(response.promise).mockResolvedValue(undefined);
    await renderWith([pay, milk, sam]);

    await user.click(screen.getByRole('button', { name: 'Delete: Buy milk' }));
    expect(screen.getByText('Buy milk')).toBeTruthy();

    response.resolve();
    await vi.waitFor(() => expect(screen.queryByText('Buy milk')).toBeNull());
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(liveRegionText()).toBe('Task deleted.');
    // next item's Delete button
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Delete: Call Sam'));

    // last item: focus goes to the previous one
    await user.click(screen.getByRole('button', { name: 'Delete: Call Sam' }));
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Delete: Pay rent'));
  });

  it('US3-AS4 (T064): deleting the only task shows "No tasks yet." and focuses the field', async () => {
    const user = userEvent.setup();
    api.deleteTask.mockResolvedValue(undefined);
    await renderWith([aTask({ title: 'Buy milk' })]);

    await user.click(screen.getByRole('button', { name: 'Delete: Buy milk' }));

    await vi.waitFor(() => expect(screen.getByText('No tasks yet.')).toBeTruthy());
    await vi.waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('New task')));
  });

  it('Edge gone (T066): a 404 removes the task and says it no longer exists', async () => {
    const user = userEvent.setup();
    api.deleteTask.mockRejectedValue(new ApiError('problem', 404, '/problems/task-not-found'));
    await renderWith([aTask({ title: 'Buy milk' }), aTask({ title: 'Call Sam' })]);

    await user.click(screen.getByRole('button', { name: 'Delete: Buy milk' }));

    await vi.waitFor(() => expect(screen.queryByText('Buy milk')).toBeNull());
    expect(screen.getByTestId('error-message').textContent).toBe('This task no longer exists.');
    expect(liveRegionText()).toBe('This task no longer exists.');
  });

  it.each([
    ['500', new ApiError('problem', 500, '/problems/internal')],
    ['503', new ApiError('problem', 503, '/problems/service-unavailable')],
    ['network', new ApiError('network')],
    ['timeout', new ApiError('timeout')],
  ])('FR-014 (T067): a failed delete (%s) shows the message and the task stays', async (_label, failure) => {
    const user = userEvent.setup();
    api.deleteTask.mockRejectedValue(failure);
    await renderWith([aTask({ title: 'Buy milk' })]);

    await user.click(screen.getByRole('button', { name: 'Delete: Buy milk' }));

    await vi.waitFor(() =>
      expect(screen.getByTestId('error-message').textContent).toBe('The task was not deleted. Try again.'),
    );
    expect(screen.getByText('Buy milk')).toBeTruthy();
  });

  it('FR-016 (T068): "Delete" works from the keyboard with Enter and with Space', async () => {
    const user = userEvent.setup();
    api.deleteTask.mockResolvedValue(undefined);
    const milk = aTask({ title: 'Buy milk', completed: true });
    const sam = aTask({ title: 'Call Sam', completed: true });
    await renderWith([milk, sam]);

    await user.tab(); // New task
    await user.tab(); // Add
    await user.tab(); // Delete: Buy milk (completed tasks have no completion button)
    expect(document.activeElement?.textContent).toBe('Delete: Buy milk');
    await user.keyboard('{Enter}');
    await vi.waitFor(() => expect(api.deleteTask).toHaveBeenCalledWith(milk.id));
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Delete: Call Sam'));

    await user.keyboard(' ');
    await vi.waitFor(() => expect(api.deleteTask).toHaveBeenCalledWith(sam.id));
    expect(liveRegionText()).toBe('Task deleted.');
  });
});
