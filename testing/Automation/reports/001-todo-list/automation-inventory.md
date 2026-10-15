# Automation inventory — 001-todo-list

**Scanned:** the whole automation root `Testing/Automation` on 2026-10-13, before any page object was written —
0 page classes found (new project). Rewritten each run.

| Screen | Decision | Class | Candidates considered | Reason |
|---|---|---|---|---|
| To-Do List page (the only screen: `/`) | create TaskListPage | TaskListPage (pages/TaskListPage.ts) | none — the automation root held no page class | First automation of this product; one class for the one screen (heading, "New task" form, messages, task list) |
| Task item (a row of the task list) | create TaskItem (component object, pages/components/TaskItem.ts) | TaskItem (pages/components/TaskItem.ts) | none — the automation root held no component or page class | A reusable widget scoped by its list-item Locator, not a page; keeps TaskListPage under ~15 locators |
