# Test Cases — 001-todo-list
**Status:** APPROVED — generated 2026-10-13 from the Approved spec and the reviewed plan
**Scope:** Acceptance test cases for the shared, public To-Do List page: view, add, complete and delete tasks, the empty state, failures, keyboard and screen-reader use, speed and first-time use.
**Generated:** 2026-10-13
**Source:** plan.md `## Test Design` (2026-10-13)
**Requirement IDs covered:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, US1-AS1, US1-AS2, US1-AS3, US1-AS4, US1-AS5, US1-AS6, US1-AS7, US1-AS8, US2-AS1, US2-AS2, US2-AS3, US2-AS4, US2-AS5, US3-AS1, US3-AS2, US3-AS3, US3-AS4, SC-001, SC-002, SC-003, SC-004, SC-005
**Total test cases:** 32 (18/5/9, per locale)
**Run-stage mapping:** happy-path + edge-case → @positive · rejection/guard assertions → @negative
**Patterns applied / skipped:** P2 async wait (loading two-step on every page load; results asserted only after the service confirms), P3 explicit trigger ("Add" click or Enter is its own step); P1 skipped (no hidden UI to reveal), P4 skipped (no tab state)
**Smoke TCs:** 4
**Automation candidates:** 30
**Requirement coverage (weighted):** 100% — Full 17 / Partial 0 / None 0 of 17 acceptance criteria
**Manual-only scenarios:** 2 (High 0 · Medium 2 · Low 0)
**Tag convention:** —
**Data items:** 3 — ready 2 · missing 0 · impossible 0 · unknown 1
**Accounts needed:** 0 — 0 confirmed · 0 unknown
**Environment rows:** 1 — 0 ready · 1 unknown
**Data checked in:** not checked

## Summary
| ID | Type | Locale | Requirement | Stage | Smoke | Automation Candidate | Data effect | Shared data | Tags | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-TODO-001 | happy-path | en | FR-006, FR-015, US1-AS1 | @positive | YES | YES | read-only | D1 empty list | — | Opening the application with no tasks shows "No tasks yet." and the "New task" field, without sign-in |
| TC-TODO-002 | happy-path | en | FR-001, FR-004, FR-013, US1-AS2 | @positive | YES | YES | creates | — | — | Adding "Buy milk" shows it at the top as not completed and clears the field |
| TC-TODO-003 | negative | en | FR-002, US1-AS3 | @negative | NO | YES | read-only | — | — | Pressing "Add" with an empty title shows "Enter a title for the task." and adds nothing |
| TC-TODO-004 | negative | en | FR-002, FR-003, US1-AS3 | @negative | NO | YES | read-only | — | — | A title of only spaces shows "Enter a title for the task." and adds nothing |
| TC-TODO-005 | edge-case | en | FR-003 | @positive | NO | YES | creates | — | — | A title typed with spaces before and after is shown without them |
| TC-TODO-006 | happy-path | en | FR-012, US1-AS4, SC-004 | @positive | NO | YES | creates | — | — | Tasks added are shown with the same titles and states after reopening the application |
| TC-TODO-007 | happy-path | en | FR-005, US1-AS5 | @positive | NO | YES | creates | — | — | Every task shows its title and whether it is completed |
| TC-TODO-008 | edge-case | en | FR-001, US1-AS6 | @positive | NO | YES | creates | — | — | Typing past 100 characters leaves exactly 100 in the field, and adding saves that title |
| TC-TODO-009 | edge-case | en | FR-001, US1-AS6 | @positive | NO | YES | creates | — | — | Pasting 120 characters leaves the first 100 in the field, and adding saves them |
| TC-TODO-010 | edge-case | en | FR-001, US1-AS7 | @positive | NO | YES | creates | — | — | Adding a title that already exists adds a second task with no warning |
| TC-TODO-011 | happy-path | en | FR-005, US1-AS8 | @positive | NO | YES | creates | — | — | A newly added task appears above the tasks added before it |
| TC-TODO-012 | edge-case | en | FR-001, Edge (double add) | @positive | NO | YES | creates | — | — | Double-clicking "Add" adds exactly one task |
| TC-TODO-013 | happy-path | en | FR-007, FR-008, US2-AS1 | @positive | YES | YES | modifies | — | — | Marking "Buy milk" as completed shows it as "Completed", visibly different from open tasks |
| TC-TODO-014 | happy-path | en | FR-012, US2-AS2, SC-004 | @positive | NO | YES | modifies | — | — | A completed task is still completed after reopening the application |
| TC-TODO-015 | happy-path | en | FR-007, US2-AS3 | @positive | NO | YES | modifies | — | — | Completing one task leaves another task not completed |
| TC-TODO-016 | negative | en | FR-009, US2-AS4 | @negative | NO | YES | modifies | — | — | A completed task offers no action to mark it as not completed |
| TC-TODO-017 | happy-path | en | FR-005, US2-AS5 | @positive | NO | YES | modifies | — | — | Completing a task does not change the order of the list |
| TC-TODO-018 | happy-path | en | FR-010, FR-011, US3-AS1 | @positive | YES | YES | deletes | — | — | Deleting "Buy milk" removes it at once with no confirmation, and the other task remains |
| TC-TODO-019 | happy-path | en | FR-010, US3-AS2 | @positive | NO | YES | deletes | — | — | A completed task can be deleted |
| TC-TODO-020 | happy-path | en | FR-011, US3-AS3, SC-004 | @positive | NO | YES | deletes | — | — | A deleted task is not shown after reopening, and no restore action exists |
| TC-TODO-021 | happy-path | en | FR-006, US3-AS4 | @positive | NO | YES | deletes | D1 empty list | — | Deleting the only task shows "No tasks yet." |
| TC-TODO-022 | negative | en | FR-014 | @negative | NO | YES | read-only | — | — | When the service cannot be reached, adding shows "The task was not added. Try again." and no task appears |
| TC-TODO-023 | negative | en | FR-014 | @negative | NO | YES | modifies | — | — | When the service cannot be reached, completing shows "The task was not marked as completed. Try again." and the task stays not completed |
| TC-TODO-024 | negative | en | FR-014 | @negative | NO | YES | deletes | — | — | When the service cannot be reached, deleting shows "The task was not deleted. Try again." and the task stays |
| TC-TODO-025 | negative | en | FR-014 | @negative | NO | YES | read-only | — | — | When the list cannot be loaded, "The tasks could not be loaded. Try again." is shown and "Try again" loads it |
| TC-TODO-026 | negative | en | FR-014, Edge (gone) | @negative | NO | YES | deletes | — | — | Completing a task someone else deleted shows "This task no longer exists." and removes it |
| TC-TODO-027 | negative | en | FR-014, Edge (gone) | @negative | NO | YES | deletes | — | — | Deleting a task someone else deleted shows "This task no longer exists." and removes it |
| TC-TODO-028 | happy-path | en | FR-016, SC-005 | @positive | NO | YES | creates | — | — | Adding, completing and deleting a task works with the keyboard only |
| TC-TODO-029 | happy-path | en | FR-016, SC-005 | @positive | NO | YES | creates | D1 empty list | — | The page has no critical or serious accessibility violations when empty, filled and showing an error |
| TC-TODO-030 | happy-path | en | FR-016, SC-005 | @positive | NO | NO | creates | — | — | A screen reader announces each task's title and completion state and the result of each action |
| TC-TODO-031 | happy-path | en | FR-013, SC-003 | @positive | NO | YES | creates | — | — | After add, complete and delete, the list shows the result within 1 second |
| TC-TODO-032 | happy-path | en | FR-001, FR-007, FR-010, SC-001, SC-002 | @positive | NO | NO | creates | — | — | First-time users add, complete and delete a task without help, adding the first in under 10 seconds |

## Test Cases

### TC-TODO-001 — Opening the application with no tasks shows "No tasks yet." and the "New task" field, without sign-in
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-006, FR-015, US1-AS1
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. The shared task list is empty [D1] (prepared in this case's setup, local environment only).
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the message "No tasks yet." is shown and no task is listed.
  3. Check the page heading — the heading "To-Do List" is shown.
  4. Check the page for a sign-in step — no sign-in form, no "Sign in" button and no password field is shown.
  5. Check the "New task" field — it is shown with the visible label "New task" and is empty.
  6. Check the "Add" button — it is shown next to the "New task" field.
- **Expected Result:** The task list opens without any sign-in, shows "No tasks yet." with 0 tasks, and offers the empty "New task" field with the "Add" button.
- **Data Oracle:** [D1] — 0 tasks | —
- **Smoke:** YES
- **Automation Candidate:** YES
- **Data effect:** read-only
- **Shared data:** D1 empty list
- **Tags:** —

### TC-TODO-002 — Adding "Buy milk" shows it at the top as not completed and clears the field
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-001, FR-004, FR-013, US1-AS2
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown and no task titled "QA-<run>-Buy milk" is listed.
  3. Type "QA-<run>-Buy milk" [D2] in "New task" — the field shows "QA-<run>-Buy milk".
  4. Click "Add" — the task "QA-<run>-Buy milk" appears as the first task in the list, without reloading the page.
  5. Check the task "QA-<run>-Buy milk" — it shows the button "Mark as completed" and not the text "Completed".
  6. Check the "New task" field — it is empty.
- **Expected Result:** "QA-<run>-Buy milk" is the first task in the list, not completed, and the "New task" field is cleared.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk", not completed | —
- **Smoke:** YES
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-003 — Pressing "Add" with an empty title shows "Enter a title for the task." and adds nothing
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-002, US1-AS3
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown; the number of tasks shown is noted as the starting count.
  3. Check the "New task" field — it is empty.
  4. Click "Add" — the message "Enter a title for the task." is shown below the "New task" field.
  5. Check the task list — the number of tasks equals the starting count from step 2 and no new task appears at the top.
- **Expected Result:** No task is created and the message "Enter a title for the task." is shown.
- **Data Oracle:** number of tasks shown in step 2 — unchanged after "Add" (0 tasks created) | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** read-only
- **Shared data:** —
- **Tags:** —

### TC-TODO-004 — A title of only spaces shows "Enter a title for the task." and adds nothing
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-002, FR-003, US1-AS3
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown; the number of tasks shown is noted as the starting count.
  3. Type three spaces "   " in "New task" — the field holds the three spaces and no other characters.
  4. Click "Add" — the message "Enter a title for the task." is shown below the "New task" field.
  5. Check the task list — the number of tasks equals the starting count from step 2 and no new task appears at the top.
- **Expected Result:** A title made only of spaces is rejected: no task is created and "Enter a title for the task." is shown.
- **Data Oracle:** number of tasks shown in step 2 — unchanged after "Add" (0 tasks created) | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** read-only
- **Shared data:** —
- **Tags:** —

### TC-TODO-005 — A title typed with spaces before and after is shown without them
- **Type:** edge-case
- **Locale:** en
- **Requirement:** FR-003
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown and no task titled "QA-<run>-Padded title" is listed.
  3. Type "  QA-<run>-Padded title  " [D2] (two spaces before and two after) in "New task" — the field shows the title with the spaces.
  4. Click "Add" — a task appears as the first task in the list.
  5. Check the title of the first task — it reads exactly "QA-<run>-Padded title", with no space before or after.
  6. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  7. Wait until "Loading tasks…" clears — the task "QA-<run>-Padded title" is listed with exactly that title, with no space before or after.
- **Expected Result:** The task is saved and shown as "QA-<run>-Padded title", without the surrounding spaces, also after reopening.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Padded title" | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-006 — Tasks added are shown with the same titles and states after reopening the application
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-012, US1-AS4, SC-004
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  3. Type "QA-<run>-Buy milk" [D2] in "New task" — the field shows "QA-<run>-Buy milk".
  4. Click "Add" — "QA-<run>-Buy milk" appears as the first task in the list.
  5. Type "QA-<run>-Call Sam" [D2] in "New task" — the field shows "QA-<run>-Call Sam".
  6. Click "Add" — "QA-<run>-Call Sam" appears as the first task, above "QA-<run>-Buy milk".
  7. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  8. Wait until "Loading tasks…" clears — "QA-<run>-Call Sam" and "QA-<run>-Buy milk" are listed, "QA-<run>-Call Sam" above "QA-<run>-Buy milk".
  9. Check both tasks — each shows the button "Mark as completed" and not the text "Completed".
- **Expected Result:** After reopening, both tasks are still shown with the same titles, in the same order, and both are still not completed.
- **Data Oracle:** [D2] — 2 tasks "QA-<run>-Call Sam", "QA-<run>-Buy milk", both not completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-007 — Every task shows its title and whether it is completed
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-005, US1-AS5
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added, through the "New task" field of [E1], the tasks "QA-<run>-Buy milk", "QA-<run>-Call Sam" and "QA-<run>-Pay rent", in that order; none is completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the three tasks "QA-<run>-Pay rent", "QA-<run>-Call Sam" and "QA-<run>-Buy milk" are listed.
  3. Check the task "QA-<run>-Pay rent" — its title is shown as text and it shows the button "Mark as completed", not the text "Completed".
  4. Check the task "QA-<run>-Call Sam" — its title is shown as text and it shows the button "Mark as completed", not the text "Completed".
  5. Check the task "QA-<run>-Buy milk" — its title is shown as text and it shows the button "Mark as completed", not the text "Completed".
- **Expected Result:** Every task of the case is shown with its title and its completion state (not completed).
- **Data Oracle:** [D2] — 3 tasks "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk", all not completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-008 — Typing past 100 characters leaves exactly 100 in the field, and adding saves that title
- **Type:** edge-case
- **Locale:** en
- **Requirement:** FR-001, US1-AS6
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  3. Type the 100-character title [D3] in "New task" — the field holds exactly 100 characters, equal to the 100-character title.
  4. Type "AAAAA" at the end of the field — the field still holds exactly 100 characters, equal to the 100-character title [D3].
  5. Click "Add" — a task appears as the first task in the list.
  6. Check the title of the first task — it is exactly the 100-character title [D3].
- **Expected Result:** The field never holds more than 100 characters, and the task is saved with the 100-character title.
- **Data Oracle:** [D3] — 100-character title (run prefix followed by "A" up to 100 characters) | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-009 — Pasting 120 characters leaves the first 100 in the field, and adding saves them
- **Type:** edge-case
- **Locale:** en
- **Requirement:** FR-001, US1-AS6
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  3. Paste the 120-character title [D3] into the empty "New task" field — the field holds exactly 100 characters, equal to the first 100 characters of the 120-character title.
  4. Click "Add" — a task appears as the first task in the list.
  5. Check the title of the first task — it is exactly the first 100 characters of the 120-character title [D3].
- **Expected Result:** The pasted text is cut to its first 100 characters and the task is saved with those 100 characters.
- **Data Oracle:** [D3] — first 100 characters of the 120-character title (run prefix followed by "P" up to 100 characters) | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-010 — Adding a title that already exists adds a second task with no warning
- **Type:** edge-case
- **Locale:** en
- **Requirement:** FR-001, US1-AS7
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1]; it is not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — exactly one task titled "QA-<run>-Buy milk" is listed.
  3. Type "QA-<run>-Buy milk" [D2] in "New task" — the field shows "QA-<run>-Buy milk".
  4. Click "Add" — a second task "QA-<run>-Buy milk" appears as the first task in the list.
  5. Check the task list — exactly two separate tasks titled "QA-<run>-Buy milk" are listed.
  6. Check the page for a warning — no warning or error message about a duplicate title is shown.
  7. Check both "QA-<run>-Buy milk" tasks — each has its own "Mark as completed" button and its own "Delete" button.
- **Expected Result:** The duplicate title is accepted without a warning and the list shows two separate "QA-<run>-Buy milk" tasks.
- **Data Oracle:** [D2] — 2 tasks titled "QA-<run>-Buy milk", both not completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-011 — A newly added task appears above the tasks added before it
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-005, US1-AS8
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added, through the "New task" field of [E1], "QA-<run>-Buy milk" and then "QA-<run>-Call Sam".
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Call Sam" is listed above "QA-<run>-Buy milk".
  3. Type "QA-<run>-Pay rent" [D2] in "New task" — the field shows "QA-<run>-Pay rent".
  4. Click "Add" — "QA-<run>-Pay rent" appears as the first task in the list.
  5. Check the order of the case's tasks — from top to bottom: "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk".
- **Expected Result:** The list shows, from top to bottom, "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk".
- **Data Oracle:** [D2] — 3 tasks in order "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk" | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-012 — Double-clicking "Add" adds exactly one task
- **Type:** edge-case
- **Locale:** en
- **Requirement:** FR-001, Edge (double add)
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown and no task titled "QA-<run>-Double add" is listed.
  3. Type "QA-<run>-Double add" [D2] in "New task" — the field shows "QA-<run>-Double add".
  4. Double-click "Add" — "QA-<run>-Double add" appears as the first task in the list.
  5. Check the task list — exactly one task titled "QA-<run>-Double add" is listed.
  6. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  7. Wait until "Loading tasks…" clears — exactly one task titled "QA-<run>-Double add" is listed.
- **Expected Result:** One add action creates exactly one task, both on screen and after reopening.
- **Data Oracle:** [D2] — exactly 1 task "QA-<run>-Double add" | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-013 — Marking "Buy milk" as completed shows it as "Completed", visibly different from open tasks
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-007, FR-008, US2-AS1
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added, through the "New task" field of [E1], "QA-<run>-Buy milk" and then "QA-<run>-Call Sam"; both are not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Call Sam" and "QA-<run>-Buy milk" are listed, each with a "Mark as completed" button.
  3. Click "Mark as completed" of the task "QA-<run>-Buy milk" (button "Mark as completed: QA-<run>-Buy milk") — the task "QA-<run>-Buy milk" shows the text "Completed".
  4. Check the title "QA-<run>-Buy milk" — it is shown struck through.
  5. Check the task "QA-<run>-Buy milk" — it has no "Mark as completed" button.
  6. Check the task "QA-<run>-Call Sam" — it shows the "Mark as completed" button, no text "Completed", and its title is not struck through.
- **Expected Result:** "QA-<run>-Buy milk" is shown as completed ("Completed", struck-through title, no completion button), visibly different from the not-completed "QA-<run>-Call Sam".
- **Data Oracle:** [D2] — "QA-<run>-Buy milk" completed, "QA-<run>-Call Sam" not completed | —
- **Smoke:** YES
- **Automation Candidate:** YES
- **Data effect:** modifies
- **Shared data:** —
- **Tags:** —

### TC-TODO-014 — A completed task is still completed after reopening the application
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-012, US2-AS2, SC-004
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1]; it is not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with a "Mark as completed" button.
  3. Click "Mark as completed" of the task "QA-<run>-Buy milk" — the task shows the text "Completed".
  4. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  5. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed.
  6. Check the task "QA-<run>-Buy milk" — it shows the text "Completed", a struck-through title and no "Mark as completed" button.
- **Expected Result:** After reopening, "QA-<run>-Buy milk" is still shown as completed.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk", completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** modifies
- **Shared data:** —
- **Tags:** —

### TC-TODO-015 — Completing one task leaves another task not completed
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-007, US2-AS3
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added, through the "New task" field of [E1], "QA-<run>-Buy milk" and then "QA-<run>-Call Sam"; both are not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Call Sam" and "QA-<run>-Buy milk" are listed, each with a "Mark as completed" button.
  3. Click "Mark as completed" of the task "QA-<run>-Buy milk" — the task "QA-<run>-Buy milk" shows the text "Completed".
  4. Check the task "QA-<run>-Call Sam" — it shows the "Mark as completed" button and not the text "Completed".
  5. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  6. Wait until "Loading tasks…" clears — "QA-<run>-Call Sam" is listed with the "Mark as completed" button and without the text "Completed".
- **Expected Result:** Only "QA-<run>-Buy milk" is completed; "QA-<run>-Call Sam" stays not completed, also after reopening.
- **Data Oracle:** [D2] — "QA-<run>-Buy milk" completed, "QA-<run>-Call Sam" not completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** modifies
- **Shared data:** —
- **Tags:** —

### TC-TODO-016 — A completed task offers no action to mark it as not completed
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-009, US2-AS4
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1]; it is not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with a "Mark as completed" button.
  3. Click "Mark as completed" of the task "QA-<run>-Buy milk" — the task shows the text "Completed".
  4. Check the actions of the task "QA-<run>-Buy milk" — the only action offered is "Delete"; there is no "Mark as completed", "Mark as not completed", "Undo" or "Reopen" action.
  5. Click the title "QA-<run>-Buy milk" — the task still shows the text "Completed".
  6. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  7. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with the text "Completed" and "Delete" as its only action.
- **Expected Result:** A completed task cannot be marked as not completed: no such action is offered and the task stays completed.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk", completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** modifies
- **Shared data:** —
- **Tags:** —

### TC-TODO-017 — Completing a task does not change the order of the list
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-005, US2-AS5
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added, through the "New task" field of [E1], "QA-<run>-Buy milk", then "QA-<run>-Call Sam", then "QA-<run>-Pay rent"; none is completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the case's tasks are listed from top to bottom: "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk".
  3. Click "Mark as completed" of the task "QA-<run>-Call Sam" — the task "QA-<run>-Call Sam" shows the text "Completed".
  4. Check the order of the case's tasks — still "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk".
  5. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  6. Wait until "Loading tasks…" clears — the case's tasks are listed from top to bottom: "QA-<run>-Pay rent", "QA-<run>-Call Sam" (completed), "QA-<run>-Buy milk".
- **Expected Result:** Completing "QA-<run>-Call Sam" leaves the order "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk" unchanged, also after reopening.
- **Data Oracle:** [D2] — 3 tasks in order "QA-<run>-Pay rent", "QA-<run>-Call Sam", "QA-<run>-Buy milk"; only "QA-<run>-Call Sam" completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** modifies
- **Shared data:** —
- **Tags:** —

### TC-TODO-018 — Deleting "Buy milk" removes it at once with no confirmation, and the other task remains
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-010, FR-011, US3-AS1
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added, through the "New task" field of [E1], "QA-<run>-Buy milk" and then "QA-<run>-Call Sam".
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Call Sam" and "QA-<run>-Buy milk" are listed.
  3. Click "Delete" of the task "QA-<run>-Buy milk" (button "Delete: QA-<run>-Buy milk") — "QA-<run>-Buy milk" disappears from the list without any confirmation dialog or question.
  4. Check the task list — of the case's tasks only "QA-<run>-Call Sam" remains.
- **Expected Result:** "QA-<run>-Buy milk" is removed immediately without a confirmation step, and only "QA-<run>-Call Sam" of the case's tasks remains.
- **Data Oracle:** [D2] — before: "QA-<run>-Call Sam", "QA-<run>-Buy milk"; after: "QA-<run>-Call Sam" only | —
- **Smoke:** YES
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** —
- **Tags:** —

### TC-TODO-019 — A completed task can be deleted
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-010, US3-AS2
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1]; it is not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with a "Mark as completed" button.
  3. Click "Mark as completed" of the task "QA-<run>-Buy milk" — the task shows the text "Completed".
  4. Click "Delete" of the task "QA-<run>-Buy milk" — "QA-<run>-Buy milk" disappears from the list.
  5. Check the task list — no task titled "QA-<run>-Buy milk" is listed.
- **Expected Result:** The completed task "QA-<run>-Buy milk" is removed from the list.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk" (completed), then 0 | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** —
- **Tags:** —

### TC-TODO-020 — A deleted task is not shown after reopening, and no restore action exists
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-011, US3-AS3, SC-004
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1].
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed.
  3. Click "Delete" of the task "QA-<run>-Buy milk" — "QA-<run>-Buy milk" disappears from the list.
  4. Close the browser window and open the To-Do List application [E1] in a new browser window — the text "Loading tasks…" appears.
  5. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown and no task titled "QA-<run>-Buy milk" is listed.
  6. Check the page for a way to restore — no "Undo", "Restore" or "Deleted tasks" action is offered.
- **Expected Result:** The deleted task does not appear after reopening and no way to restore it is offered.
- **Data Oracle:** [D2] — 0 tasks titled "QA-<run>-Buy milk" after the delete | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** —
- **Tags:** —

### TC-TODO-021 — Deleting the only task shows "No tasks yet."
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-006, US3-AS4
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. The shared task list is empty [D1] (prepared in this case's setup, local environment only).
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the message "No tasks yet." is shown and no task is listed.
  3. Type "QA-<run>-Only task" [D2] in "New task" — the field shows "QA-<run>-Only task".
  4. Click "Add" — "QA-<run>-Only task" is listed as the only task and "No tasks yet." is no longer shown.
  5. Click "Delete" of the task "QA-<run>-Only task" — "QA-<run>-Only task" disappears from the list.
  6. Check the task list — the message "No tasks yet." is shown and no task is listed.
- **Expected Result:** After the only task is deleted the list is empty and shows "No tasks yet."
- **Data Oracle:** [D1] — 0 tasks; [D2] — 1 task "QA-<run>-Only task" after the add, 0 tasks after the delete | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** D1 empty list
- **Tags:** —

### TC-TODO-022 — When the service cannot be reached, adding shows "The task was not added. Try again." and no task appears
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-014
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown and no task titled "QA-<run>-Not added" is listed.
  3. Type "QA-<run>-Not added" [D2] in "New task" — the field shows "QA-<run>-Not added".
  4. Make the To-Do List service unreachable for the next request — the page still shows the typed title in "New task".
  5. Click "Add" — the message "The task was not added. Try again." is shown near the list.
  6. Check the task list — no task titled "QA-<run>-Not added" is listed.
  7. Close the browser window and open the To-Do List application [E1] in a new browser window (service reachable) — the text "Loading tasks…" appears.
  8. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown and no task titled "QA-<run>-Not added" is listed.
- **Expected Result:** The failure is reported as "The task was not added. Try again." and the task is not shown as added, on screen or after reopening.
- **Data Oracle:** [D2] — 0 tasks titled "QA-<run>-Not added" | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** read-only
- **Shared data:** —
- **Tags:** —

### TC-TODO-023 — When the service cannot be reached, completing shows "The task was not marked as completed. Try again." and the task stays not completed
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-014
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1]; it is not completed.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with a "Mark as completed" button.
  3. Make the To-Do List service unreachable for the next request — "QA-<run>-Buy milk" is still listed as not completed.
  4. Click "Mark as completed" of the task "QA-<run>-Buy milk" — the message "The task was not marked as completed. Try again." is shown near the list.
  5. Check the task "QA-<run>-Buy milk" — it still shows the "Mark as completed" button, no text "Completed", and its title is not struck through.
  6. Close the browser window and open the To-Do List application [E1] in a new browser window (service reachable) — the text "Loading tasks…" appears.
  7. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with the "Mark as completed" button and without the text "Completed".
- **Expected Result:** The failure is reported as "The task was not marked as completed. Try again." and "QA-<run>-Buy milk" stays not completed.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk", not completed | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** modifies
- **Shared data:** —
- **Tags:** —

### TC-TODO-024 — When the service cannot be reached, deleting shows "The task was not deleted. Try again." and the task stays
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-014
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1].
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed.
  3. Make the To-Do List service unreachable for the next request — "QA-<run>-Buy milk" is still listed.
  4. Click "Delete" of the task "QA-<run>-Buy milk" — the message "The task was not deleted. Try again." is shown near the list.
  5. Check the task list — "QA-<run>-Buy milk" is still listed.
  6. Close the browser window and open the To-Do List application [E1] in a new browser window (service reachable) — the text "Loading tasks…" appears.
  7. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is still listed.
- **Expected Result:** The failure is reported as "The task was not deleted. Try again." and "QA-<run>-Buy milk" stays in the list.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk" | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** —
- **Tags:** —

### TC-TODO-025 — When the list cannot be loaded, "The tasks could not be loaded. Try again." is shown and "Try again" loads it
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-014
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running; page language English.
  2. The To-Do List service is made unreachable for loading the task list until step 3.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the message "The tasks could not be loaded. Try again." and the "Try again" button are shown, and no task list is shown.
  3. Make the To-Do List service reachable again — the message "The tasks could not be loaded. Try again." is still shown.
  4. Click "Try again" — the text "Loading tasks…" appears.
  5. Wait until "Loading tasks…" clears — the message "The tasks could not be loaded. Try again." and the "Try again" button are gone, and the task list (or "No tasks yet." when the list is empty) is shown.
- **Expected Result:** A failed load is reported as "The tasks could not be loaded. Try again.", and "Try again" loads the list once the service is reachable.
- **Data Oracle:** — (no task data asserted; the case checks that the load error is replaced by the task list area) | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** read-only
- **Shared data:** —
- **Tags:** —

### TC-TODO-026 — Completing a task someone else deleted shows "This task no longer exists." and removes it
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-014, Edge (gone)
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1]; it is not completed.
- **Steps:**
  1. Open the To-Do List application [E1] in the first browser window — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed with a "Mark as completed" button.
  3. Open the To-Do List application [E1] in a second browser window — the text "Loading tasks…" appears.
  4. Wait until "Loading tasks…" clears in the second window — "QA-<run>-Buy milk" is listed.
  5. In the second window, click "Delete" of the task "QA-<run>-Buy milk" — "QA-<run>-Buy milk" disappears from the list in the second window.
  6. Switch to the first browser window without reloading — "QA-<run>-Buy milk" is still listed there.
  7. Click "Mark as completed" of the task "QA-<run>-Buy milk" — the message "This task no longer exists." is shown near the list.
  8. Check the task list in the first window — no task titled "QA-<run>-Buy milk" is listed.
- **Expected Result:** The user is told "This task no longer exists." and the task is removed from their list.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk", deleted in the second window; 0 afterwards | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** —
- **Tags:** —

### TC-TODO-027 — Deleting a task someone else deleted shows "This task no longer exists." and removes it
- **Type:** negative
- **Locale:** en
- **Requirement:** FR-014, Edge (gone)
- **Stage:** @negative
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Setup [D2]: this case added the task "QA-<run>-Buy milk" through the "New task" field of [E1].
- **Steps:**
  1. Open the To-Do List application [E1] in the first browser window — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — "QA-<run>-Buy milk" is listed.
  3. Open the To-Do List application [E1] in a second browser window — the text "Loading tasks…" appears.
  4. Wait until "Loading tasks…" clears in the second window — "QA-<run>-Buy milk" is listed.
  5. In the second window, click "Delete" of the task "QA-<run>-Buy milk" — "QA-<run>-Buy milk" disappears from the list in the second window.
  6. Switch to the first browser window without reloading — "QA-<run>-Buy milk" is still listed there.
  7. Click "Delete" of the task "QA-<run>-Buy milk" — the message "This task no longer exists." is shown near the list.
  8. Check the task list in the first window — no task titled "QA-<run>-Buy milk" is listed.
- **Expected Result:** The user is told "This task no longer exists." and the task is removed from their list.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Buy milk", deleted in the second window; 0 afterwards | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** deletes
- **Shared data:** —
- **Tags:** —

### TC-TODO-028 — Adding, completing and deleting a task works with the keyboard only
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-016, SC-005
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. Only the keyboard is used from step 3 on; the mouse is not touched.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  3. Press Tab until the "New task" field has focus — the focus indicator is visible on "New task".
  4. Type "QA-<run>-Keyboard 1" [D2] — the field shows "QA-<run>-Keyboard 1".
  5. Press Enter — "QA-<run>-Keyboard 1" appears as the first task in the list.
  6. Check the "New task" field — it is empty and still has focus.
  7. Type "QA-<run>-Keyboard 2" [D2] — the field shows "QA-<run>-Keyboard 2".
  8. Press Enter — "QA-<run>-Keyboard 2" appears as the first task, above "QA-<run>-Keyboard 1".
  9. Press Tab until the button "Mark as completed: QA-<run>-Keyboard 2" has focus — the focus indicator is visible on that button.
  10. Press Enter — the task "QA-<run>-Keyboard 2" shows the text "Completed".
  11. Press Tab or Shift+Tab until the button "Delete: QA-<run>-Keyboard 2" has focus — the focus indicator is visible on that button.
  12. Press Enter — "QA-<run>-Keyboard 2" disappears from the list.
  13. Check the focus — it is on the button "Delete: QA-<run>-Keyboard 1".
  14. Press Enter — "QA-<run>-Keyboard 1" disappears from the list.
- **Expected Result:** A task is added, completed and deleted using only the keyboard, with visible focus at every step and focus moved to the next task's "Delete" button after a delete.
- **Data Oracle:** [D2] — 2 tasks "QA-<run>-Keyboard 2", "QA-<run>-Keyboard 1"; 0 after the deletes | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-029 — The page has no critical or serious accessibility violations when empty, filled and showing an error
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-016, SC-005
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. The shared task list is empty [D1] (prepared in this case's setup, local environment only).
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the message "No tasks yet." is shown and no task is listed.
  3. Run the automated accessibility scan (WCAG 2.2 AA rules) on the page — it reports 0 critical and 0 serious violations.
  4. Type "QA-<run>-Access 1" [D2] in "New task" — the field shows "QA-<run>-Access 1".
  5. Click "Add" — "QA-<run>-Access 1" is listed as the first task.
  6. Type "QA-<run>-Access 2" [D2] in "New task" — the field shows "QA-<run>-Access 2".
  7. Click "Add" — "QA-<run>-Access 2" is listed as the first task, above "QA-<run>-Access 1".
  8. Click "Mark as completed" of the task "QA-<run>-Access 1" — the task "QA-<run>-Access 1" shows the text "Completed".
  9. Run the automated accessibility scan (WCAG 2.2 AA rules) on the page — it reports 0 critical and 0 serious violations.
  10. Click "Add" with the "New task" field empty — the message "Enter a title for the task." is shown below the "New task" field.
  11. Run the automated accessibility scan (WCAG 2.2 AA rules) on the page — it reports 0 critical and 0 serious violations.
  12. Make the To-Do List service unreachable for the next request — the two tasks are still listed.
  13. Click "Delete" of the task "QA-<run>-Access 2" — the message "The task was not deleted. Try again." is shown near the list.
  14. Run the automated accessibility scan (WCAG 2.2 AA rules) on the page — it reports 0 critical and 0 serious violations.
- **Expected Result:** The empty state, a filled list with a completed and a not-completed task, and both error messages show 0 critical and 0 serious automated accessibility violations.
- **Data Oracle:** [D1] — 0 tasks at the start; [D2] — 2 tasks "QA-<run>-Access 2" (not completed), "QA-<run>-Access 1" (completed) | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** D1 empty list
- **Tags:** —

### TC-TODO-030 — A screen reader announces each task's title and completion state and the result of each action
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-016, SC-005
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. A screen reader (for example NVDA with Google Chrome) is running and the tester navigates with the keyboard and the screen reader only.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  3. [HUMAN] Move the screen reader to the "New task" field — it announces an edit field named "New task".
  4. [HUMAN] Type "QA-<run>-Screen reader" [D2] and press Enter — the screen reader announces "Task added."
  5. [HUMAN] Move the screen reader to the task "QA-<run>-Screen reader" — it announces the title "QA-<run>-Screen reader" and that the task is not completed.
  6. [HUMAN] Move to the button of that task and activate it — the screen reader announced the button as "Mark as completed: QA-<run>-Screen reader" and then announces "Task marked as completed."
  7. [HUMAN] Move the screen reader to the task "QA-<run>-Screen reader" — it announces the title and "Completed".
  8. [HUMAN] Move to the button "Delete: QA-<run>-Screen reader" and activate it — the screen reader announces "Task deleted."
  9. [HUMAN] Move to the "New task" field, leave it empty and press Enter — the screen reader announces "Enter a title for the task."
- **Expected Result:** The screen reader announces every task's title and completion state, the item-specific button names, and the result of add, complete, delete and the title-required error.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Screen reader"; 0 after the delete | —
- **Smoke:** NO
- **Automation Candidate:** NO
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-031 — After add, complete and delete, the list shows the result within 1 second
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-013, SC-003
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable under normal conditions (no slowed or blocked requests); page language English.
- **Steps:**
  1. Open the To-Do List application [E1] — the text "Loading tasks…" appears.
  2. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  3. Type "QA-<run>-Timing" [D2] in "New task" — the field shows "QA-<run>-Timing".
  4. Click "Add" — "QA-<run>-Timing" appears as the first task within 1 second of the click.
  5. Click "Mark as completed" of the task "QA-<run>-Timing" — the task shows the text "Completed" within 1 second of the click.
  6. Click "Delete" of the task "QA-<run>-Timing" — "QA-<run>-Timing" disappears from the list within 1 second of the click.
- **Expected Result:** Each of add, complete and delete shows its result in the list within 1 second.
- **Data Oracle:** [D2] — 1 task "QA-<run>-Timing"; 0 after the delete | —
- **Smoke:** NO
- **Automation Candidate:** YES
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

### TC-TODO-032 — First-time users add, complete and delete a task without help, adding the first in under 10 seconds
- **Type:** happy-path
- **Locale:** en
- **Requirement:** FR-001, FR-007, FR-010, SC-001, SC-002
- **Stage:** @positive
- **Preconditions:**
  1. The To-Do List application [E1] is running and reachable; page language English.
  2. A usability session is set up with first-time users (people who have never seen the application); a facilitator observes, times and records each participant without helping.
- **Steps:**
  1. [HUMAN] Give the participant the instruction "Add a task, mark it as completed, then delete it" and no further help — the participant confirms they understood the instruction.
  2. [HUMAN] Ask the participant to open the To-Do List application [E1] and start the timer — the text "Loading tasks…" appears.
  3. Wait until "Loading tasks…" clears — the task list (or "No tasks yet.") is shown.
  4. [HUMAN] Observe the participant type a title of their choice in "New task" and add it; stop the timer when the task appears in the list — the participant's task appears less than 10 seconds after opening the application.
  5. [HUMAN] Observe the participant mark their task as completed — the task shows the text "Completed" without any help being given.
  6. [HUMAN] Observe the participant delete their task — the task disappears from the list without any help being given.
  7. [HUMAN] After all participants, compute the share who added, completed and deleted a task on their first attempt without help — the share is at least 95 %.
- **Expected Result:** First-time users add their first task in under 10 seconds, and at least 95 % add, complete and delete a task on their first attempt without help.
- **Data Oracle:** the title each participant typed, as recorded by the facilitator; 1 task per participant, 0 after their delete | —
- **Smoke:** NO
- **Automation Candidate:** NO
- **Data effect:** creates
- **Shared data:** —
- **Tags:** —

## Test Data

### 0. Environment
| ID | What | Value | Status |
|---|---|---|---|
| E1 | application base URL — local build (web app dev server) | secret name E1_URL — value never written here | UNKNOWN |

### 1. Accounts
| ID | Role | Username | Secret name | Status | Used by TCs | Note |
|---|---|---|---|---|---|---|
| — | — | — | — | N/A — no sign-in (FR-015) | — | No account is needed: the application has no sign-in and every action is public (FR-015). |

### 2. Test data at a glance
| # | Data item (plain name) | Must look like | Used by TCs | Status | Best way to get it |
|---|---|---|---|---|---|
| D1 | Empty task list | The shared list holds 0 tasks when the case starts; the page shows "No tasks yet." | TC-TODO-001, TC-TODO-021, TC-TODO-029 | UNKNOWN | api — delete each task through the public task service, local environment only; contract confirmed, reachability UNKNOWN until the run |
| D2 | Tasks owned by the case | Titles start with the run prefix "QA-<run>-" (for example "QA-<run>-Buy milk"); added through the page by the case itself | TC-TODO-002, TC-TODO-005, TC-TODO-006, TC-TODO-007, TC-TODO-010, TC-TODO-011, TC-TODO-012, TC-TODO-013, TC-TODO-014, TC-TODO-015, TC-TODO-016, TC-TODO-017, TC-TODO-018, TC-TODO-019, TC-TODO-020, TC-TODO-021, TC-TODO-022, TC-TODO-023, TC-TODO-024, TC-TODO-026, TC-TODO-027, TC-TODO-028, TC-TODO-029, TC-TODO-030, TC-TODO-031 | READY | e2e scenario |
| D3 | A 100-character and a 120-character title | 100-character title: run prefix followed by "A" up to exactly 100 characters; 120-character title: run prefix followed by "P" up to exactly 120 characters | TC-TODO-008, TC-TODO-009 | READY | inline |

### 3. Data item details
#### D1 — Empty task list
- **What it is:** The one shared task list with no task in it, so the empty state ("No tasks yet.") can be checked.
- **Exact values needed:** 0 tasks in the list when the case starts.
- **Used by:** TC-TODO-001, TC-TODO-021, TC-TODO-029
- **Where I checked:** research.md R9 (empty-list preparation through the public task service, local environment only); the contract confirms a public list and a public delete per task
- **Status:** UNKNOWN — the preparation way is confirmed by the contract, but the service's reachability on the local environment is known only at the run.
- **Shared with other TCs:** yes — TC-TODO-001, TC-TODO-021 and TC-TODO-029 each prepare their own empty list in setup; they run serially because the list is shared (research R9); no case needs another's result.

#### D2 — Tasks owned by the case
- **What it is:** Tasks a case adds itself through the "New task" field, each title starting with the run's unique prefix so the case finds and cleans up only its own tasks.
- **Exact values needed:** titles as written in each case, for example "QA-<run>-Buy milk", "QA-<run>-Call Sam", "QA-<run>-Pay rent"; completion state as stated in the case's setup.
- **Used by:** TC-TODO-002, TC-TODO-005, TC-TODO-006, TC-TODO-007, TC-TODO-010, TC-TODO-011, TC-TODO-012, TC-TODO-013, TC-TODO-014, TC-TODO-015, TC-TODO-016, TC-TODO-017, TC-TODO-018, TC-TODO-019, TC-TODO-020, TC-TODO-021, TC-TODO-022, TC-TODO-023, TC-TODO-024, TC-TODO-026, TC-TODO-027, TC-TODO-028, TC-TODO-029, TC-TODO-030, TC-TODO-031
- **Where I checked:** research.md R9 (run prefix, cases add their own tasks through the page)
- **Status:** READY — created by each case through the page by design.
- **Shared with other TCs:** no — each case owns its tasks; data-changing cases run serially on the shared list.

#### D3 — A 100-character and a 120-character title
- **What it is:** Two typed inputs for the 100-character limit, typed and pasted.
- **Exact values needed:** 100-character title = run prefix "QA-<run>-" followed by the letter "A" repeated until the title is exactly 100 characters; 120-character title = run prefix "QA-<run>-" followed by the letter "P" repeated until the title is exactly 120 characters (its first 100 characters are the expected saved title in TC-TODO-009).
- **Used by:** TC-TODO-008, TC-TODO-009
- **Where I checked:** plan.md Test data (inline in the case)
- **Status:** READY — inline values, nothing to prepare.
- **Shared with other TCs:** no

### 4. Problems — data that cannot be created or is unclear
| # | Data item | Problem | Why | What the QC / PO must decide |
|---|---|---|---|---|
| 1 | D1 Empty task list | Preparing an empty list deletes every task on the local environment, including tasks this run did not create (QC-7 normally cleans up owned data only). | The list is one shared global list; a test-only reset was rejected (research R9), so emptying means deleting every task. | Decided in research R9: allowed on the local environment only; never prepare D1 on any shared environment. |

### 5. How to prepare the missing data
#### D1 — Empty task list  (recommended: api)
| Way | How, in plain words | Cleanup after | Availability |
|---|---|---|---|
| e2e scenario | Open the To-Do List application [E1] and press "Delete" on every task until "No tasks yet." is shown | none — the case's own tasks are removed by the case | available (slow when the list is long) |
| api | List all tasks and delete each task through the public task service, local environment only | none — the case's own tasks are removed by the case | available — contract confirmed (research R9); reachability UNKNOWN until the run |
| db | Remove every task record directly | — | to be confirmed — not recommended |
| set directly | — | — | N/A — no setting holds tasks |
| manual | QC deletes every task by hand through the page, then re-checks that "No tasks yet." is shown | QC decides | always available |

#### D2 — Tasks owned by the case  (recommended: e2e scenario)
| Way | How, in plain words | Cleanup after | Availability |
|---|---|---|---|
| e2e scenario | Open the To-Do List application [E1], type the title with the run prefix in "New task", click "Add" (and "Mark as completed" where the setup says completed) | delete the case's own tasks (run prefix) with "Delete" after evidence | available |
| api | Add the task through the public task service | delete it the same way | available — contract confirmed; not needed |
| manual | QC adds the tasks by hand following the e2e steps, then re-checks | QC decides | always available |

#### D3 — A 100-character and a 120-character title  (recommended: inline)
| Way | How, in plain words | Cleanup after | Availability |
|---|---|---|---|
| inline | Build the two titles in the case as described in D3 | delete the task the case added (run prefix) | available |

## Enhancement Log
| TC-ID | What changed | Why (what the application showed) | Run / date |
|---|---|---|---|

none yet — corrections found during implementation are appended here (QC-8)

Regenerated 2026-10-13 (QC-4): plan.md Test Design gave TC-TODO-012, TC-TODO-015, TC-TODO-031 and TC-TODO-032 an
FR id in their Requirement field (FR-001; FR-007; FR-013; FR-001, FR-007, FR-010), so the automation validator can
trace them. No step, type, stage or data field changed.

## Traceability Matrix
| Acceptance criterion | REQ-ID | TC-IDs | Status | Missing |
|---|---|---|---|---|
| US1-AS1 Empty list shown without sign-in, with the add field | FR-006, FR-015 | TC-TODO-001 | Fully Covered | — |
| US1-AS2 Add "Buy milk": listed, not completed, field cleared | FR-001, FR-004, FR-013 | TC-TODO-002, TC-TODO-022 | Fully Covered | — |
| US1-AS3 Empty or spaces-only title rejected with a message | FR-002, FR-003 | TC-TODO-003, TC-TODO-004 | Fully Covered | — |
| US1-AS4 Tasks kept after closing and reopening | FR-012, SC-004 | TC-TODO-006 | Fully Covered | — |
| US1-AS5 Every task shows title and completion state | FR-005 | TC-TODO-007, TC-TODO-013 | Fully Covered | — |
| US1-AS6 Field holds at most 100 characters, typed or pasted | FR-001 | TC-TODO-008, TC-TODO-009 | Fully Covered | — |
| US1-AS7 Duplicate title added without warning | FR-001 | TC-TODO-010 | Fully Covered | — |
| US1-AS8 Newest task first | FR-005 | TC-TODO-011 | Fully Covered | — |
| US2-AS1 Mark as completed, visibly different | FR-007, FR-008 | TC-TODO-013, TC-TODO-023, TC-TODO-026 | Fully Covered | — |
| US2-AS2 Completed state kept after reopening | FR-012, SC-004 | TC-TODO-014 | Fully Covered | — |
| US2-AS3 Other tasks stay not completed | FR-007 | TC-TODO-015 | Fully Covered | — |
| US2-AS4 No action to mark as not completed | FR-009 | TC-TODO-016 | Fully Covered | — |
| US2-AS5 Completing keeps the order | FR-005 | TC-TODO-017 | Fully Covered | — |
| US3-AS1 Delete at once, no confirmation, other task remains | FR-010, FR-011 | TC-TODO-018, TC-TODO-024, TC-TODO-027 | Fully Covered | — |
| US3-AS2 Completed task can be deleted | FR-010 | TC-TODO-019 | Fully Covered | — |
| US3-AS3 Deleted task gone after reopening, no restore | FR-011, SC-004 | TC-TODO-020 | Fully Covered | — |
| US3-AS4 Deleting the only task shows "No tasks yet." | FR-006 | TC-TODO-021 | Fully Covered | — |
| Edge — spaces before/after removed; spaces-only is empty | FR-003, FR-002 | TC-TODO-005, TC-TODO-004 | Fully Covered | — |
| Edge — one add action creates exactly one task | — (no FR traced in the plan) | TC-TODO-012 | Fully Covered | no FR-nnn on the plan row |
| Edge — action fails (connection lost): message, last saved state kept | FR-014 | TC-TODO-022, TC-TODO-023, TC-TODO-024, TC-TODO-025 | Fully Covered | — |
| Edge — task already deleted by someone else | FR-014 | TC-TODO-026, TC-TODO-027 | Fully Covered | — |
| Edge — title at most 100 characters, typed or pasted | FR-001 | TC-TODO-008, TC-TODO-009 | Fully Covered | — |
| Edge — duplicate titles, each completed and deleted on its own | FR-001 | TC-TODO-010 | Partially Covered | no case completes or deletes one of two same-titled tasks and checks the other is unchanged |
| SC-001 First task added in under 10 seconds | SC-001 | TC-TODO-032 | Fully Covered (manual-only) | — |
| SC-002 95 % of first-time users succeed without help | SC-002 | TC-TODO-032 | Fully Covered (manual-only) | number of participants not stated in the spec |
| SC-003 Result shown within 1 second | SC-003 | TC-TODO-031 | Fully Covered | — |
| SC-004 Saved tasks and states unchanged after reopening | SC-004 | TC-TODO-006, TC-TODO-014, TC-TODO-020 | Fully Covered | — |
| SC-005 Keyboard only and screen-reader announcements | SC-005 | TC-TODO-028, TC-TODO-029, TC-TODO-030 | Fully Covered | screen-reader part manual-only (TC-TODO-030) |

## Negative Coverage
| Negative category | Covered by | Status |
|---|---|---|
| Invalid input | TC-TODO-004 | COVERED |
| Boundary | TC-TODO-008, TC-TODO-009 | COVERED |
| Missing required | TC-TODO-003 | COVERED |
| Unauthorized | — | N/A — no sign-in, every action is public by FR-015 |
| Error recovery | TC-TODO-022, TC-TODO-023, TC-TODO-024, TC-TODO-025, TC-TODO-026, TC-TODO-027 | COVERED |

## Standards Alignment
| Standard item | Status | TC-IDs |
|---|---|---|
| QC-6 loading two-step ("Loading tasks…" appears; clears and the list is ready) asserted on every page load | COVERED | TC-TODO-001 to TC-TODO-032 |
| QC-6 explicit trigger ("Add" click or Enter) is its own step with an assertion | COVERED | TC-TODO-002 to TC-TODO-012, TC-TODO-021, TC-TODO-022, TC-TODO-028 to TC-TODO-031 |
| QC-6 Data Oracle named for every rendered-data assertion | COVERED | TC-TODO-001 to TC-TODO-032 |
| QC-6 state transitions (not completed → completed, → deleted, invalid reopen) | COVERED | TC-TODO-013, TC-TODO-016, TC-TODO-018, TC-TODO-019 |
| QC-7 no URL, username, password or secret; configuration by token [E1] / [D1]–[D3] | COVERED | TC-TODO-001 to TC-TODO-032 |
| QC-7 unique ownership (run prefix "QA-<run>-"), serial data-changing cases, cleanup of owned tasks | COVERED | all cases using [D2] |
| Principle I public access declared (no sign-in) | COVERED | TC-TODO-001 |
| Accessibility WCAG 2.2 AA — automated axe scan, 0 critical / serious | COVERED | TC-TODO-029 |
| Accessibility — keyboard only (FR-016) | COVERED | TC-TODO-028 |
| Accessibility — screen reader (FR-016) | COVERED (manual-only) | TC-TODO-030 |
| FR-014 failures reported in plain language (research R8 texts) | COVERED | TC-TODO-022 to TC-TODO-027 |
| SC-003 response within 1 second | COVERED | TC-TODO-031 |
| Platform Scope — English only, Locale en | COVERED | TC-TODO-001 to TC-TODO-032 |
| Localization / RTL | N/A — English only (Platform Scope) | — |

## Requirement Coverage Score
| AC | REQ-ID | TC-IDs | Status | What is missing |
|---|---|---|---|---|
| US1-AS1 Empty list shown without sign-in, with the add field | FR-006, FR-015 | TC-TODO-001 | Fully Covered | — |
| US1-AS2 Add "Buy milk": listed, not completed, field cleared | FR-001, FR-004, FR-013 | TC-TODO-002, TC-TODO-003, TC-TODO-004, TC-TODO-008, TC-TODO-009, TC-TODO-022 | Fully Covered | — |
| US1-AS3 Empty or spaces-only title rejected with a message | FR-002, FR-003 | TC-TODO-003, TC-TODO-004 | Fully Covered | — (the scenario's outcome is a rejection, asserted by the negative cases) |
| US1-AS4 Tasks kept after closing and reopening | FR-012, SC-004 | TC-TODO-006 | Fully Covered | — |
| US1-AS5 Every task shows title and completion state | FR-005 | TC-TODO-007, TC-TODO-013 | Fully Covered | — |
| US1-AS6 Field holds at most 100 characters, typed or pasted | FR-001 | TC-TODO-008, TC-TODO-009 | Fully Covered | — |
| US1-AS7 Duplicate title added without warning | FR-001 | TC-TODO-010 | Fully Covered | — |
| US1-AS8 Newest task first | FR-005 | TC-TODO-011 | Fully Covered | — |
| US2-AS1 Mark as completed, visibly different | FR-007, FR-008 | TC-TODO-013, TC-TODO-016, TC-TODO-023, TC-TODO-026 | Fully Covered | — |
| US2-AS2 Completed state kept after reopening | FR-012, SC-004 | TC-TODO-014 | Fully Covered | — |
| US2-AS3 Other tasks stay not completed | FR-007 | TC-TODO-015 | Fully Covered | — |
| US2-AS4 No action to mark as not completed | FR-009 | TC-TODO-016 | Fully Covered | — (the scenario's outcome is a guard, asserted by the negative case) |
| US2-AS5 Completing keeps the order | FR-005 | TC-TODO-017 | Fully Covered | — |
| US3-AS1 Delete at once, no confirmation, other task remains | FR-010, FR-011 | TC-TODO-018, TC-TODO-024, TC-TODO-027 | Fully Covered | — |
| US3-AS2 Completed task can be deleted | FR-010 | TC-TODO-019 | Fully Covered | — |
| US3-AS3 Deleted task gone after reopening, no restore | FR-011, SC-004 | TC-TODO-020 | Fully Covered | — |
| US3-AS4 Deleting the only task shows "No tasks yet." | FR-006 | TC-TODO-021 | Fully Covered | — |

Weighted requirement coverage = (17 + 0.5 × 0) / 17 = 100 %.

## Manual-Only Scenarios
| Category | TC-ID | Scenario | Why manual | Priority |
|---|---|---|---|---|
| Human-observed step | TC-TODO-030 | A screen reader announces each task's title and completion state and the result of each action | NO — screen-reader output needs human judgement | Medium |
| Human-observed step | TC-TODO-032 | First-time users add, complete and delete a task without help, adding the first in under 10 seconds | NO — usability session with real first-time users | Medium |

## Execution Results
| TC-ID | Run / date | Build | Result | Tester | Evidence | Note |
|---|---|---|---|---|---|---|

## Potential Bugs

none

## Open Questions

none

## Open Findings for the Human Reviewer
### Requirement / coverage gaps
- The plan rows of TC-TODO-012 (Edge (double add)), TC-TODO-015 (US2-AS3), TC-TODO-031 (SC-003) and TC-TODO-032 (SC-001, SC-002) carry no FR-nnn; the automation validator recognises only FR tokens. Adding one in plan.md `## Test Design` (for example FR-001, FR-007, FR-013) and regenerating this file would fix it.
- Edge case "duplicate titles are completed and deleted on their own" is only partly covered: TC-TODO-010 checks two separate tasks with their own buttons, but no case completes or deletes one duplicate and checks the other is unchanged.
- The reopen cases (TC-TODO-006, TC-TODO-014, TC-TODO-020) reopen the page in a new browser window; a restart of the task service is covered only by the developer service test for US1-AS4.
### Application defects
- None
### Pending implementation
- None
### Environment blockers
- The Constitution's Quality Control configuration still has TODO values for the local environment, LOCAL_RUN_COMMAND and runner — the automation run waits for /speckit-constitution.
### Unclear requirements
- SC-002 ("at least 95 % of first-time users") states no number of participants for the usability session in TC-TODO-032; the QC / PO decides the sample size before the session.
