import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { deferred } from '../../test-utils';
import TaskForm from './TaskForm';
import type { AddResult } from './TaskForm';

function renderForm(onAdd = vi.fn<(title: string) => Promise<AddResult>>().mockResolvedValue('ok')) {
  const onInvalid = vi.fn();
  render(<TaskForm onAdd={onAdd} onInvalid={onInvalid} inputRef={createRef<HTMLInputElement>()} />);
  const input = screen.getByLabelText('New task') as HTMLInputElement;
  const addButton = screen.getByRole('button', { name: 'Add' });
  return { onAdd, onInvalid, input, addButton };
}

describe('TaskForm', () => {
  it('US1-AS3 (T018): an empty or white-space title shows the message and sends no request', async () => {
    const user = userEvent.setup();
    const { onAdd, onInvalid, input, addButton } = renderForm();

    await user.click(addButton);
    expect(screen.getByText('Enter a title for the task.')).toBeTruthy();
    expect(onInvalid).toHaveBeenCalledWith('Enter a title for the task.');

    await user.type(input, '   ');
    await user.click(addButton);

    expect(onAdd).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('new-task-error');
  });

  it('US1-AS6 (T024): typing past 100 characters keeps the first 100, and adding sends them', async () => {
    const user = userEvent.setup();
    const { onAdd, input, addButton } = renderForm();

    expect(input.maxLength).toBe(100);
    await user.type(input, 'a'.repeat(105));
    expect(input.value).toBe('a'.repeat(100));

    await user.click(addButton);
    expect(onAdd).toHaveBeenCalledWith('a'.repeat(100));
  });

  it('US1-AS6 (T024): pasting 120 characters keeps the first 100', async () => {
    const user = userEvent.setup();
    const { onAdd, input, addButton } = renderForm();
    const pasted = 'p'.repeat(100) + 'q'.repeat(20);

    await user.click(input);
    await user.paste(pasted);
    expect(input.value).toBe('p'.repeat(100));

    await user.click(addButton);
    expect(onAdd).toHaveBeenCalledWith('p'.repeat(100));
  });

  it('US1 edge (T028): quick repeated submits send one request', async () => {
    const user = userEvent.setup();
    const pending = deferred<AddResult>();
    const { onAdd, input, addButton } = renderForm(vi.fn().mockReturnValue(pending.promise));

    await user.type(input, 'Buy milk');
    await user.dblClick(addButton);
    await user.type(input, '{Enter}');
    expect(onAdd).toHaveBeenCalledTimes(1);

    pending.resolve('ok');
    await vi.waitFor(() => expect(input.value).toBe(''));
  });

  it('FR-016 (T031): a task can be added with the keyboard only, and focus stays in the field', async () => {
    const user = userEvent.setup();
    const { onAdd, input } = renderForm();

    await user.tab();
    expect(document.activeElement).toBe(input);
    await user.keyboard('Buy milk{Enter}');

    expect(onAdd).toHaveBeenCalledWith('Buy milk');
    await vi.waitFor(() => expect(input.value).toBe(''));
    expect(document.activeElement).toBe(input);
  });

  it('keeps the title when adding fails', async () => {
    const user = userEvent.setup();
    const { input, addButton } = renderForm(vi.fn().mockResolvedValue('failed'));

    await user.type(input, 'Buy milk');
    await user.click(addButton);

    expect(input.value).toBe('Buy milk');
  });
});
