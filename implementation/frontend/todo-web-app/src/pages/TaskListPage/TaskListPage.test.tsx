import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../../api/http';
import { aTask, deferred, renderStrict } from '../../test-utils';
import { api, liveRegionText, resetApi, waitForList } from './pageTestSetup';
import TaskListPage from './TaskListPage';

vi.mock('../../api/tasksApi');

describe('TaskListPage — US1 add and view', () => {
  beforeEach(() => {
    resetApi();
  });

  it('US1-AS1 (T014): an empty list shows "No tasks yet." and the "New task" field, with no sign-in', async () => {
    const load = deferred<never[]>();
    api.listTasks.mockReturnValue(load.promise);
    renderStrict(<TaskListPage />);

    expect(screen.getByTestId('loading-indicator').textContent).toBe('Loading tasks…');
    load.resolve([]);
    await waitForList();

    expect(screen.getByText('No tasks yet.')).toBeTruthy();
    expect(screen.getByLabelText('New task')).toBeTruthy();
    expect(screen.queryByText(/sign in|log in|password/i)).toBeNull();
  });

  it('US1-AS2 (T016): adding "Buy milk" puts it at the top as not completed and clears the field', async () => {
    const user = userEvent.setup();
    const older = aTask({ title: 'Call Sam' });
    const created = aTask({ title: 'Buy milk' });
    api.listTasks.mockResolvedValue([older]);
    api.createTask.mockResolvedValue(created);
    renderStrict(<TaskListPage />);
    await waitForList();

    const input = screen.getByLabelText('New task') as HTMLInputElement;
    await user.type(input, 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await vi.waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
    const [first, second] = screen.getAllByRole('listitem');
    expect(within(first).getByText('Buy milk')).toBeTruthy();
    expect(within(first).getByText('Not completed')).toBeTruthy();
    expect(within(second).getByText('Call Sam')).toBeTruthy();
    expect(input.value).toBe('');
    expect(api.createTask).toHaveBeenCalledWith('Buy milk');
    expect(liveRegionText()).toBe('Task added.');
  });

  it.each([
    ['500', new ApiError('problem', 500, '/problems/internal')],
    ['503', new ApiError('problem', 503, '/problems/service-unavailable')],
    ['network', new ApiError('network')],
    ['timeout', new ApiError('timeout')],
  ])('FR-014 (T029): a failed load (%s) shows the message and "Try again" loads the list', async (_label, failure) => {
    const user = userEvent.setup();
    api.listTasks.mockRejectedValue(failure);
    renderStrict(<TaskListPage />);

    await vi.waitFor(() => expect(screen.getByTestId('load-error')).toBeTruthy());
    expect(screen.getByTestId('load-error').textContent).toBe('The tasks could not be loaded. Try again.');
    expect(liveRegionText()).toBe('The tasks could not be loaded. Try again.');

    api.listTasks.mockResolvedValue([aTask({ title: 'Buy milk' })]);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    await vi.waitFor(() => expect(screen.getByText('Buy milk')).toBeTruthy());
    expect(screen.queryByTestId('load-error')).toBeNull();
  });

  it.each([
    ['500', new ApiError('problem', 500, '/problems/internal')],
    ['503', new ApiError('problem', 503, '/problems/service-unavailable')],
    ['network', new ApiError('network')],
    ['timeout', new ApiError('timeout')],
  ])('FR-014 (T029): a failed add (%s) shows the message and adds nothing', async (_label, failure) => {
    const user = userEvent.setup();
    api.listTasks.mockResolvedValue([]);
    api.createTask.mockRejectedValue(failure);
    renderStrict(<TaskListPage />);
    await waitForList();

    await user.type(screen.getByLabelText('New task'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await vi.waitFor(() => expect(screen.getByTestId('error-message').textContent).toBe('The task was not added. Try again.'));
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(screen.getByText('No tasks yet.')).toBeTruthy();
    expect(liveRegionText()).toBe('The task was not added. Try again.');
  });

  it('a title the Task Service rejects as missing shows the title message', async () => {
    const user = userEvent.setup();
    api.listTasks.mockResolvedValue([]);
    api.createTask.mockRejectedValue(
      new ApiError('problem', 400, '/problems/validation', [{ field: 'title', code: 'required' }]),
    );
    renderStrict(<TaskListPage />);
    await waitForList();

    await user.type(screen.getByLabelText('New task'), 'x');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await vi.waitFor(() => expect(screen.getByTestId('title-error').textContent).toBe('Enter a title for the task.'));
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});
