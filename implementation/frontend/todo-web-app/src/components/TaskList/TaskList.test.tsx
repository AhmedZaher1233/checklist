import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { aTask } from '../../test-utils';
import TaskList from './TaskList';

function renderList(tasks = [aTask()]) {
  render(
    <TaskList
      tasks={tasks}
      busyIds={new Set()}
      onComplete={vi.fn()}
      onDelete={vi.fn()}
      registerDeleteButton={vi.fn()}
    />,
  );
}

describe('TaskList', () => {
  it('US1-AS5 (T021): every item shows its title as text and its completion state', () => {
    const open = aTask({ title: 'Buy milk', completed: false });
    const done = aTask({ title: 'Pay rent', completed: true });
    renderList([done, open]);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    const doneItem = within(items[0]);
    expect(doneItem.getByText('Pay rent')).toBeTruthy();
    expect(doneItem.getByText('Completed')).toBeTruthy();
    expect(items[0].className).toContain('task--completed');

    const openItem = within(items[1]);
    expect(openItem.getByText('Buy milk')).toBeTruthy();
    expect(openItem.getByText('Not completed')).toBeTruthy();
    expect(items[1].className).not.toContain('task--completed');
  });

  it('renders a title as text, never as HTML', () => {
    renderList([aTask({ title: '<b>bold</b>' })]);
    expect(screen.getByText('<b>bold</b>')).toBeTruthy();
    expect(document.querySelector('b')).toBeNull();
  });

  it('shows "No tasks yet." for an empty list', () => {
    renderList([]);
    expect(screen.getByText('No tasks yet.')).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
