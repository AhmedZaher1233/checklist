# Accessibility

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principle II

## Rules

1. **Semantic HTML first.** Use native elements (`button`, `input`, `label`, `ul`/`li`, headings) before ARIA; a
   custom control is used only when no native element fits, and then it has the full ARIA role, state and keyboard
   behaviour.
2. **Keyboard.** Every action is reachable and usable with the keyboard alone, in a logical tab order, with a
   visible focus indicator; focus is never trapped and moves to a sensible place after content is added or removed.
3. **Names and states.** Every control has an accessible name (visible label preferred); states such as checked or
   disabled are exposed to assistive technology; icon-only buttons name the item they act on.
4. **Announcements.** Results of an action that do not move focus (success, failure, validation messages) are
   announced through a polite live region; validation messages are linked to their field.
5. **Contrast and zoom.** Text and controls meet the contrast WCAG 2.2 AA requires; the layout works
   at 200 % zoom and at 320 px width.
6. **Verification.** Automated axe-core checks run in the acceptance tests for every screen and state with zero
   critical or serious violations (Constitution, Quality Control configuration); keyboard and screen-reader checks
   that cannot be automated are manual test cases.
7. **Conformance level**: WCAG 2.2 level AA.
