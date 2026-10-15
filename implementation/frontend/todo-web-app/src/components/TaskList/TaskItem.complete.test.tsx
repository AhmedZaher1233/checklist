import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { aTask } from '../../test-utils';
import TaskItem from './TaskItem';

function renderItem(completed: boolean) {
  const task = aTask({ title: 'Buy milk', completed });
  render(
    <ul>
      <TaskItem task={task} busy={false} onComplete={vi.fn()} onDelete={vi.fn()} registerDeleteButton={vi.fn()} />
    </ul>,
  );
  return task;
}

describe('TaskItem completion', () => {
  it('US2-AS4 (T047): a completed task offers no way to mark it as not completed', () => {
    renderItem(true);
    expect(screen.queryByRole('button', { name: /completed/i })).toBeNull();
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Delete: Buy milk' })).toBeTruthy();
  });

  it('a not-completed task offers "Mark as completed" named with its title', () => {
    renderItem(false);
    expect(screen.getByRole('button', { name: 'Mark as completed: Buy milk' })).toBeTruthy();
  });
});
