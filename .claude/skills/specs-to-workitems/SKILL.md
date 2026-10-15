---
name: "specs-to-workitems"
description: "Create Azure DevOps Boards work items for an approved feature spec — Epic (business area) → Feature (spec) → User Story (each spec user story, with acceptance criteria and priority) — in the Azure DevOps project of this repository's remote, without duplicates. Tasks are not synced. Use instead of /speckit-taskstoissues (GitHub only)."
argument-hint: "Feature ID, optionally the business area and area / iteration paths, e.g. '004 area=<business area>'"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Mirror an approved spec to Azure DevOps Boards. **Create-only**: never edits or deletes existing work items, so the
team's changes on the board are kept. Re-running it creates only what is missing (for example stories added by an
amendment).

| Azure DevOps | From |
|---|---|
| Epic | The feature's **business area** (one Epic per area, shared by its features) |
| Feature | The spec: `###: <feature name>` |
| User Story | Each spec user story: `###-US1: <story title>`, with acceptance criteria and priority |
| Task | Not synced — tasks stay in `tasks.md` |

## Prerequisites

- Azure CLI with the Azure DevOps extension (`az --version`, `az extension show --name azure-devops`). If missing,
  tell the user to install them (`az extension add --name azure-devops`); stop.
- Signed in (`az account show`, or `AZURE_DEVOPS_EXT_PAT` set). If not, ask the user to run `! az login`; stop. Never
  ask for, print, or store a token.

## Workflow

### 1. Select the feature and check it is approved

- Feature from the input, or `.specify/feature.json`. Read its `spec.md`.
- The spec must have `**Status**: Approved` with an `**Approved**: … — Business team` line; otherwise stop.

### 2. Resolve the project from the remote

- `git config --get remote.origin.url` must be an Azure DevOps URL
  (`https://[user@]dev.azure.com/<org>/<project>/_git/<repo>` or `https://<org>.visualstudio.com/<project>/_git/<repo>`).
- Organization `https://dev.azure.com/<org>`; project = `<project>` URL-decoded. Pass `--org` and `--project` on every
  `az boards` command. **Never create work items in a project that does not match the remote.**

### 3. Process and work item types

`az devops project show --project "<project>" --org <org> --query capabilities.processTemplate.templateName -o tsv`:

| Process | Epic | Feature | Story item | Acceptance criteria field |
|---|---|---|---|---|
| Agile | Epic | Feature | User Story | `Microsoft.VSTS.Common.AcceptanceCriteria` |
| Scrum | Epic | Feature | Product Backlog Item | `Microsoft.VSTS.Common.AcceptanceCriteria` |
| CMMI | Epic | Feature | Requirement | `Microsoft.VSTS.Common.AcceptanceCriteria` |
| Basic | Epic | Issue | Issue (child) | description |

Inherited processes use the system process they derive from; if unclear, ask.

### 4. Business area

Use the area from the input. Otherwise ask the user which business area the feature belongs to, suggesting the
area of related features already on the board. (Where the area is recorded permanently is still open.)

### 5. Build the items

- **Epic**: title = business area; reused if an Epic with that title and tag `speckit` exists.
- **Feature**: `###: <feature name>`; description = the spec's one-line summary and the `spec.md` path; parent = Epic.
- **Story item** per spec user story: `###-US<n>: <story title>`; description = the story text; acceptance criteria =
  its acceptance scenarios (Given / When / Then); priority P1 → 1, P2 → 2, P3 → 3, P4+ → 4; parent = Feature.
- Tags: `speckit; spec-###`. Area and iteration paths from the input, if given.

### 6. Find existing items (no duplicates)

`az boards query --org <org> --project "<project>" --wiql "SELECT [System.Id], [System.Title], [System.WorkItemType] FROM workitems WHERE [System.TeamProject] = '<project>' AND [System.Tags] CONTAINS 'speckit'"`

Match by title (`###:`, `###-US<n>:`, Epic title). Matched items are reused as parents and not created again.

### 7. Confirm (no writes yet)

Show organization, project, process, business area, and the items to create vs. already existing. Ask to confirm.

### 8. Create

In order Epic → Feature → story items, for each missing item:
`az boards work-item create --org <org> --project "<project>" --type "<type>" --title "<title>" --description "<description>" [--area "<area>"] [--iteration "<iteration>"] --fields "System.Tags=speckit; spec-###" "<acceptance criteria field>=<scenarios>" "Microsoft.VSTS.Common.Priority=<n>" -o json`,
then link to its parent: `az boards work-item relation add --org <org> --id <child> --relation-type parent --target-id <parent>`.
On failure: stop, report what was created, show the error; a re-run continues.

### 9. Report

Links to the Epic and Feature (`<org>/<project>/_workitems/edit/<id>`), and counts created and reused.
