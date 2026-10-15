// fixtures/test.ts — fixtures that wrap prerequest/ functions so teardown is guaranteed
// (references/code-craft.md §6). Specs import { test, expect } from here.
//
//   qaRun          the case's own run prefix ("QA-p{phase}-w{worker}-r{retry}-{rand}"); every task the case
//                  creates is titled "{qaRun}-…" ([D2]). Teardown deletes exactly those tasks — after the
//                  test body and the afterEach evidence hook, so the evidence image never shows a cleaned list.
//   emptyTaskList  [D1]: the shared list is emptied through the public API before the case (local only).
import { test as base } from '@playwright/test';
import { uniqueName } from '../helpers/test-data';
import { deleteTasksWithPrefix, emptyTaskList } from '../prerequest/TaskPreRequest';
import { TIMEOUTS } from '../timeouts';

type TaskFixtures = {
  qaRun: string;
  emptyTaskList: void;
};

export const test = base.extend<TaskFixtures>({
  qaRun: async ({ request }, use) => {
    const run = uniqueName('QA');
    await use(run);
    await deleteTasksWithPrefix(request, run);
  },
  emptyTaskList: [
    async ({ request }, use) => {
      await emptyTaskList(request);
      await use();
    },
    { timeout: TIMEOUTS.hook },
  ],
});

export { expect } from '@playwright/test';
