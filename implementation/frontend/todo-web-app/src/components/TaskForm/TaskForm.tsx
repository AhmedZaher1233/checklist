import { useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';

import { MAX_TITLE_LENGTH, MESSAGES } from '../../common/messages';

export type AddResult = 'ok' | 'invalid' | 'failed';

interface TaskFormProps {
  onAdd: (title: string) => Promise<AddResult>;
  onInvalid: (message: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * The "New task" form. One submit sends at most one request (research R6); an empty or white-space title is
 * rejected here without a request, and the Task Service checks it again (research R2).
 */
export default function TaskForm({ onAdd, onInvalid, inputRef }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  const showTitleRequired = () => {
    setTitleError(MESSAGES.titleRequired);
    onInvalid(MESSAGES.titleRequired);
    inputRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) {
      return;
    }
    if (title.trim() === '') {
      showTitleRequired();
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    setTitleError(null);
    try {
      const result = await onAdd(title);
      if (result === 'ok') {
        setTitle('');
      } else if (result === 'invalid') {
        showTitleRequired();
      }
    } finally {
      inFlight.current = false;
      setSubmitting(false);
      inputRef.current?.focus();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-task">New task</label>
      <div className="task-form__row">
        <input
          id="new-task"
          ref={inputRef}
          type="text"
          autoComplete="off"
          maxLength={MAX_TITLE_LENGTH}
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, MAX_TITLE_LENGTH))}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? 'new-task-error' : undefined}
          data-testid="new-task-input"
        />
        <button type="submit" aria-disabled={submitting || undefined} data-testid="add-button">
          Add
        </button>
      </div>
      {titleError && (
        <p id="new-task-error" className="field-error" data-testid="title-error">
          {titleError}
        </p>
      )}
    </form>
  );
}
