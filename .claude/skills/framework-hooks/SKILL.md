---
name: "framework-hooks"
description: "Internal skill, run automatically as the Spec Kit hooks in .specify/extensions.yml: routes every /speckit-specify input by content (one new feature, one change, several items), and gates /speckit-plan and /speckit-implement on the required approvals, reviews, and dependencies."
argument-hint: "The hook point: before_specify, before_plan, or before_implement"
user-invocable: false
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

The input names the hook point. If it is empty, infer it from the Spec Kit command being run. For `before_plan` and
`before_implement`, the feature is the one in `.specify/feature.json`. Never fill an approval or review line
yourself; this skill writes no files.

## before_specify — route the input

The input given to `/speckit-specify` can be a **file or a description**, the **whole** scope or **part** of it, and
can contain **new features, changes to existing features, or both**. Decide by content, never by format.

1. Read the input (for `.docx` / `.pdf`, extract its text). Load the existing features: `specs/feature-map.md`, and
   for each `specs/<###-name>/spec.md` only its title, status, user story headings, Key Entities, and Dependencies.
2. Split the input into **items**: one new capability, or one change to one existing feature (same actors working on
   the same screens, data, or process that feature's stories cover).
3. Route:

   | Input contains | Result | Action |
   |---|---|---|
   | One new feature | **New** | `Continue /speckit-specify.` Then ask: "Do existing features depend on this one?" For each: not implemented yet (Delivery Not planned / Planned) → suggest `/amend ###` to add the dependency; already implemented → only its wave is updated in the feature map. |
   | One change to one existing feature | **Amend ###** | `STOP: do not continue /speckit-specify.` Invoke `/amend ### <change>`. |
   | Several items (any mix of new and changes) | **Several** | `STOP: do not continue /speckit-specify.` Invoke the internal `intake` skill with the input. |
   | Matches a **Cancelled** feature | **Ask** | Ask: reactivate ### (→ `/amend ### resume` as Draft) or create a new feature. |
   | Unclear | **Ask** | Ask one question: new feature, or which feature to change. Then continue with the answer. |

   If the input explicitly asks for a new, separate feature, respect that. A description of **one** feature that only
   cites a document as its reference (as `intake` passes it) is **one item**, not Several.
4. Output: `## Feature routing` · `Result: …` · `Reason: …` (one or two sentences, naming the matching feature).

## before_plan — gate

Pass only when all are true:

1. `spec.md` has `**Status**: Approved` and an `**Approved**: … — Business team` line.
2. If the spec is in a change set (its Amended or Approved line says `(with ###…)`), every spec in the set is Approved.
3. `spec.md` has no `[NEEDS CLARIFICATION]` markers.
4. The **architecture status** — the latest **Document History** row of `architecture/solution-architecture.md` —
   allows planning this feature:
   - **Approved — Tech team** → pass;
   - **Update required** → pass only if the row's summary does **not** name this feature (`###:`); a feature named
     there waits for `/architecture update` (tech team);
   - **Draft** (an architecture update is being decided) → blocked for every feature until it is approved (tech team).
   Specs that do not affect the architecture never change this status.

## before_implement — gate

Pass only when all are true:

1. `tasks.md` has a filled `**Reviewed**: … — Tech lead` line at the top, and every `## Phase N: Convergence` section
   that still has open tasks has its own filled `**Reviewed**:` line.
2. Every feature in the spec's **Depends on** has Delivery `Implemented` in `specs/feature-map.md` — unless `plan.md`
   Complexity Tracking justifies the exception (for example building against a stub).

## Gate output

- **Pass** → `Framework gate (<hook point>): Pass. Continue.`
- **Blocked** → `Framework gate (<hook point>): Blocked — <each missing item, and who must act: business team, tech
  team, or tech lead>.` and end with `STOP: do not continue <command>.`
