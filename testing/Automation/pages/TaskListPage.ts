// pages/TaskListPage.ts — the To-Do List page (the product's only screen).
// Locators confirmed in source (implementation/frontend/todo-web-app/src):
//   TaskForm.tsx         new-task-input (label "New task"), add-button ("Add"), title-error
//   StatusMessage.tsx    live-region (role status), error-message
//   TaskListPage.tsx     heading "To-Do List", loading-indicator, load-error, retry-button ("Try again")
//   TaskList.tsx         empty-message, task-list (ul, aria-label "Tasks"), task-item-<id>
//
// Network control lives here, not in specs: the list request is HELD while "Loading tasks…" is asserted
// (the local service answers faster than an observer can see the indicator — the hold makes the TC's
// two-step loading assertion deterministic without changing the product), and a request can be made to
// fail on purpose for the FR-014 cases ("make the service unreachable", research R9).
import AxeBuilder from '@axe-core/playwright';
import { expect, type BrowserContext, type Locator, type Page, type Route } from '@playwright/test';
import { TIMEOUTS } from '../timeouts';
import { TaskItem } from './components/TaskItem';

const TASKS_ROUTE = '**/api/v1/tasks**';
const LIST_PATH = /\/api\/v1\/tasks\/?(\?.*)?$/;

/** SC-003: the list shows the result of add, complete and delete within this bound (timeouts.ts). */
export const RESULT_WITHIN_MS = TIMEOUTS.requirements.result_shown;

export class TaskListPage {
  readonly heading: Locator;
  readonly newTaskInput: Locator;
  readonly addButton: Locator;
  readonly titleError: Locator;
  readonly liveRegion: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;
  readonly loadError: Locator;
  readonly retryButton: Locator;
  readonly emptyMessage: Locator;
  readonly taskList: Locator;
  readonly taskItems: Locator;

  private listFailing = false;
  private releaseHeld: () => void = () => {};
  private heldUntilReleased: Promise<void> = Promise.resolve();
  private failNextChange = false;
  private dialogs = 0;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.newTaskInput = page.getByTestId('new-task-input');
    this.addButton = page.getByTestId('add-button');
    this.titleError = page.getByTestId('title-error');
    this.liveRegion = page.getByTestId('live-region');
    this.errorMessage = page.getByTestId('error-message');
    this.loadingIndicator = page.getByTestId('loading-indicator');
    this.loadError = page.getByTestId('load-error');
    this.retryButton = page.getByTestId('retry-button');
    this.emptyMessage = page.getByTestId('empty-message');
    this.taskList = page.getByTestId('task-list');
    this.taskItems = page.getByTestId(/^task-item-/);
    page.on('dialog', (dialog) => {
      this.dialogs += 1;
      void dialog.dismiss();
    });
  }

  /* ------------------------------ opening and loading ------------------------------ */

  /** Step "Open the To-Do List application [E1] — the text "Loading tasks…" appears". */
  static async open(page: Page, options: { listUnreachable?: boolean } = {}): Promise<TaskListPage> {
    const taskList = new TaskListPage(page);
    await page.route(TASKS_ROUTE, (route) => taskList.handle(route));
    taskList.holdListLoading();
    taskList.listFailing = !!options.listUnreachable;
    await page.goto('/');
    await expect(taskList.loadingIndicator, '"Loading tasks…" appears').toHaveText('Loading tasks…');
    return taskList;
  }

  /** Step "Close the browser window and open the To-Do List application [E1] in a new browser window". */
  async reopenInNewWindow(): Promise<TaskListPage> {
    const context = this.page.context();
    await this.page.close();
    return TaskListPage.open(await context.newPage());
  }

  /** Step "Open the To-Do List application [E1] in a second browser window". */
  static async openSecondWindow(context: BrowserContext): Promise<TaskListPage> {
    return TaskListPage.open(await context.newPage());
  }

  /** Step "Wait until "Loading tasks…" clears" — the list (or "No tasks yet.") is ready. */
  async waitForListReady(): Promise<void> {
    this.releaseHeld();
    await expect(this.loadingIndicator, '"Loading tasks…" clears').toBeHidden();
    await expect(this.taskList.or(this.emptyMessage), 'the task list or "No tasks yet." is shown').toBeVisible();
  }

  /** Wait until "Loading tasks…" clears after a failed load: the load error replaces the list. */
  async waitForLoadFailure(): Promise<void> {
    this.releaseHeld();
    await expect(this.loadingIndicator, '"Loading tasks…" clears').toBeHidden();
    await expect(this.loadError, 'the load error is shown').toHaveText('The tasks could not be loaded. Try again.');
    await expect(this.retryButton, 'the "Try again" button is shown').toBeVisible();
    await expect(this.taskList.or(this.emptyMessage), 'no task list is shown').toHaveCount(0);
  }

  /** TC-TODO-025 step 3: the list request reaches the service again (and is held for the next loading check). */
  async makeListReachableAgain(): Promise<void> {
    this.listFailing = false;
    this.holdListLoading();
    await expect(this.loadError, 'the load error is still shown').toHaveText('The tasks could not be loaded. Try again.');
  }

  async expectLoadErrorGone(): Promise<void> {
    await expect(this.loadError, 'the load error is gone').toHaveCount(0);
    await expect(this.retryButton, '"Try again" is gone').toHaveCount(0);
  }

  async clickTryAgain(): Promise<void> {
    await this.retryButton.click();
    await expect(this.loadingIndicator, '"Loading tasks…" appears').toHaveText('Loading tasks…');
  }

  /** The next add / complete / delete request fails as if the service were unreachable (FR-014, research R9). */
  makeServiceUnreachableForNextChange(): void {
    this.failNextChange = true;
  }

  private holdListLoading(): void {
    this.heldUntilReleased = new Promise<void>((release) => {
      this.releaseHeld = release;
    });
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const isList = request.method() === 'GET' && LIST_PATH.test(new URL(request.url()).pathname);
    if (isList) {
      await this.heldUntilReleased;
      if (this.listFailing) return route.abort('failed');
    }
    if (!isList && request.method() !== 'GET' && this.failNextChange) {
      this.failNextChange = false;
      return route.abort('failed');
    }
    // the page may have aborted a held request itself (React StrictMode re-runs the load effect)
    await route.fallback().catch(() => undefined);
  }

  /* ------------------------------ the "New task" form ------------------------------ */

  async typeTitle(title: string): Promise<void> {
    await this.newTaskInput.fill(title);
    await expect(this.newTaskInput, 'the field shows the typed title').toHaveValue(title);
  }

  /** Types character by character at the end of the field, like a person (used past the 100-character limit). */
  async typeAtEnd(text: string): Promise<void> {
    await this.newTaskInput.press('End');
    await this.newTaskInput.pressSequentially(text);
  }

  /** Pastes through the system clipboard, the way a person pastes with Ctrl+V. */
  async pasteTitle(text: string): Promise<void> {
    const origin = new URL(this.page.url()).origin;
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
    await this.page.evaluate((value) => navigator.clipboard.writeText(value), text);
    await this.newTaskInput.click();
    await this.newTaskInput.press('ControlOrMeta+V');
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
  }

  async doubleClickAdd(): Promise<void> {
    await this.addButton.dblclick();
  }

  async expectFieldValue(value: string): Promise<void> {
    await expect(this.newTaskInput, 'the "New task" field holds exactly this value').toHaveValue(value);
  }

  async expectFieldEmpty(): Promise<void> {
    await expect(this.newTaskInput, 'the "New task" field is empty').toHaveValue('');
  }

  async expectTitleRequiredMessage(): Promise<void> {
    await expect(this.titleError, '"Enter a title for the task." is shown below the field').toHaveText('Enter a title for the task.');
  }

  /* ------------------------------ messages ------------------------------ */

  async expectErrorMessage(text: string): Promise<void> {
    await expect(this.errorMessage, 'the error message is shown near the list').toHaveText(text);
  }

  async expectNoWarnings(): Promise<void> {
    await expect(this.errorMessage, 'no error message is shown').toHaveCount(0);
    await expect(this.titleError, 'no field message is shown').toHaveCount(0);
  }

  async expectNoDialogShown(): Promise<void> {
    expect(this.dialogs, 'no confirmation dialog or question was shown').toBe(0);
  }

  async expectNoRestoreAction(): Promise<void> {
    await expect(this.page.getByRole('button', { name: /undo|restore|deleted tasks/i }), 'no restore button').toHaveCount(0);
    await expect(this.page.getByRole('link', { name: /undo|restore|deleted tasks/i }), 'no restore link').toHaveCount(0);
  }

  /* ------------------------------ page structure ------------------------------ */

  async expectHeading(): Promise<void> {
    await expect(this.heading, 'the heading "To-Do List" is shown').toHaveText('To-Do List');
  }

  async expectNoSignIn(): Promise<void> {
    await expect(this.page.locator('input[type="password"]'), 'no password field').toHaveCount(0);
    await expect(this.page.getByRole('button', { name: /sign in|log in/i }), 'no "Sign in" button').toHaveCount(0);
    await expect(this.page.getByRole('form', { name: /sign in|log in/i }), 'no sign-in form').toHaveCount(0);
  }

  async expectNewTaskFieldOffered(): Promise<void> {
    await expect(this.page.getByLabel('New task', { exact: true }), 'the field has the visible label "New task"').toBeVisible();
    await expect(this.newTaskInput, 'the "New task" field is empty').toHaveValue('');
  }

  /** The "Add" button is shown next to the "New task" field (same row, to its right). */
  async expectAddButtonNextToField(): Promise<void> {
    await expect(this.addButton, 'the "Add" button is shown').toHaveText('Add');
    const field = await this.newTaskInput.boundingBox();
    const button = await this.addButton.boundingBox();
    expect(field && button, 'both controls are rendered').toBeTruthy();
    if (field && button) {
      expect(button.x, '"Add" is to the right of the field').toBeGreaterThanOrEqual(field.x + field.width);
      expect(Math.abs(button.y + button.height / 2 - (field.y + field.height / 2)), '"Add" is on the field\'s row').toBeLessThan(field.height);
    }
  }

  /* ------------------------------ the task list ------------------------------ */

  /** The row of the task with exactly this title (titles of a case are unique through its run prefix). */
  task(title: string): TaskItem {
    return new TaskItem(this.taskItems.filter({ has: this.page.getByTestId('task-title').getByText(title, { exact: true }) }));
  }

  /** The n-th row (0-based) of the tasks with exactly this title — for duplicate titles (TC-TODO-010). */
  taskWithTitleAt(title: string, index: number): TaskItem {
    // filter-scoped by title: the index picks one of the identical-title rows, whose order is the requirement
    return new TaskItem(this.taskItems.filter({ has: this.page.getByTestId('task-title').getByText(title, { exact: true }) }).nth(index));
  }

  async taskCount(): Promise<number> {
    return this.taskItems.count();
  }

  async expectTaskCount(count: number): Promise<void> {
    await expect(this.taskItems, `the list shows ${count} task(s)`).toHaveCount(count);
  }

  async expectEmptyList(): Promise<void> {
    await expect(this.emptyMessage, '"No tasks yet." is shown').toHaveText('No tasks yet.');
    await expect(this.taskItems, 'no task is listed').toHaveCount(0);
  }

  /** The newest task is first (FR-005): the task at the top of the list has exactly this title. */
  async expectFirstTask(title: string, options: { within?: number } = {}): Promise<void> {
    // the list is ordered newest first (FR-005); the TC verifies the task at the top
    const first = new TaskItem(this.taskItems.first());
    await expect(first.title, `"${title}" is the first task`).toHaveText(title, { timeout: options.within });
  }

  async expectTaskListed(title: string, options: { within?: number } = {}): Promise<void> {
    await expect(this.task(title).root, `"${title}" is listed`).toBeVisible({ timeout: options.within });
  }

  async expectNoTaskTitled(title: string, options: { within?: number } = {}): Promise<void> {
    await expect(this.task(title).root, `no task titled "${title}" is listed`).toHaveCount(0, { timeout: options.within });
  }

  /** SC-003: the task shows the text "Completed" within `within` ms of the click. */
  async expectTaskCompletedWithin(title: string, within: number): Promise<void> {
    await expect(this.task(title).state, `"${title}" shows "Completed" in time`).toHaveText('Completed', { timeout: within });
  }

  async expectTaskTitledCount(title: string, count: number): Promise<void> {
    await expect(this.task(title).root, `exactly ${count} task(s) titled "${title}"`).toHaveCount(count);
  }

  /** The order of the case's own tasks (titles starting with its run prefix), top to bottom. */
  async expectCaseOrder(run: string, titles: string[]): Promise<void> {
    const ownTitles = this.taskItems.getByTestId('task-title').filter({ hasText: new RegExp(`^${escapeRegExp(run)}`) });
    await expect(ownTitles, 'the case\'s tasks, top to bottom').toHaveText(titles);
  }

  /** Adds tasks through the "New task" field in the given order (the cases' [D2] setup through the page). */
  static async addThroughPage(context: BrowserContext, titles: string[]): Promise<void> {
    const setup = await TaskListPage.open(await context.newPage());
    await setup.waitForListReady();
    for (const title of titles) {
      await setup.typeTitle(title);
      await setup.clickAdd();
      await setup.expectFirstTask(title);
    }
    await setup.page.close();
  }

  /* ------------------------------ keyboard (FR-016) ------------------------------ */

  /** Presses Tab (or Shift+Tab) until `target` has focus; fails after `maxPresses`. */
  async tabUntilFocused(target: Locator, options: { backwards?: boolean; maxPresses?: number } = {}): Promise<void> {
    const key = options.backwards ? 'Shift+Tab' : 'Tab';
    for (let presses = 0; presses < (options.maxPresses ?? 30); presses++) {
      if (await target.evaluate((element) => element === document.activeElement)) return;
      await this.page.keyboard.press(key);
    }
    await expect(target, 'the element receives keyboard focus').toBeFocused();
  }

  async tabToNewTaskField(): Promise<void> {
    await this.tabUntilFocused(this.newTaskInput);
  }

  async typeWithKeyboard(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }

  async pressEnter(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  /** Focus is on `target` and the focus indicator (the outline) is visible. */
  async expectVisibleFocus(target: Locator): Promise<void> {
    await expect(target, 'the element has keyboard focus').toBeFocused();
    await expect(target, 'the focus indicator is visible').toHaveCSS('outline-style', 'solid');
  }

  /* ------------------------------ accessibility (FR-016, WCAG 2.2 AA) ------------------------------ */

  async expectNoSeriousAccessibilityViolations(): Promise<void> {
    const results = await new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations
      .filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
      .map((violation) => `${violation.impact}: ${violation.id} (${violation.nodes.length} node(s))`);
    expect(serious, 'no critical or serious accessibility violations').toEqual([]);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
