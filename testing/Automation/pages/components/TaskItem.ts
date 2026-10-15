// pages/components/TaskItem.ts — one row of the task list (component object, scoped by its list item).
// Locators confirmed in source: implementation/frontend/todo-web-app/src/components/TaskList/TaskItem.tsx
// (data-testid task-item-<id>, task-title, task-state, task-complete-<id>, task-delete-<id>).
import { expect, type Locator } from '@playwright/test';

export class TaskItem {
  readonly title: Locator;
  readonly state: Locator;
  readonly completeButton: Locator;
  readonly deleteButton: Locator;
  readonly actions: Locator;

  constructor(readonly root: Locator) {
    this.title = root.getByTestId('task-title');
    this.state = root.getByTestId('task-state');
    this.completeButton = root.getByTestId(/^task-complete-/);
    this.deleteButton = root.getByTestId(/^task-delete-/);
    this.actions = root.getByRole('button');
  }

  async markCompleted(): Promise<void> {
    await this.completeButton.click();
  }

  async delete(): Promise<void> {
    await this.deleteButton.click();
  }

  async clickTitle(): Promise<void> {
    await this.title.click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root, 'the task is listed').toBeVisible();
  }

  /** Not completed: the "Mark as completed" button is offered, no visible "Completed" text, title not struck through. */
  async expectNotCompleted(): Promise<void> {
    await expect(this.completeButton, 'a not-completed task offers "Mark as completed"').toBeVisible();
    await expect(this.root.getByText('Completed', { exact: true }), 'a not-completed task shows no "Completed" text').toHaveCount(0);
    await expect(this.title, 'the title of a not-completed task is not struck through').not.toHaveCSS('text-decoration-line', 'line-through');
  }

  /** Completed: the text "Completed", a struck-through title and no "Mark as completed" button (FR-008, FR-009). */
  async expectCompleted(): Promise<void> {
    await expect(this.state, 'a completed task shows the text "Completed"').toHaveText('Completed');
    await expect(this.state).toBeVisible();
    await expect(this.title, 'the title of a completed task is struck through').toHaveCSS('text-decoration-line', 'line-through');
    await expect(this.completeButton, 'a completed task has no "Mark as completed" button').toHaveCount(0);
  }

  /** FR-009: "Delete" is the only action of a completed task — no complete / not-completed / undo / reopen. */
  async expectOnlyActionIsDelete(): Promise<void> {
    await expect(this.actions, 'exactly one action is offered').toHaveCount(1);
    await expect(this.deleteButton, 'that action is "Delete"').toBeVisible();
    await expect(this.root.getByRole('button', { name: /mark as (not )?completed|undo|reopen/i })).toHaveCount(0);
  }

  async expectOwnActions(): Promise<void> {
    await expect(this.completeButton, 'the task has its own "Mark as completed" button').toHaveCount(1);
    await expect(this.deleteButton, 'the task has its own "Delete" button').toHaveCount(1);
  }

  async expectTitleExactly(title: string): Promise<void> {
    await expect(this.title, 'the title is shown exactly, as text').toHaveText(title, { useInnerText: true });
  }
}
