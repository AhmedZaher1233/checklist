# Test Cases — hash-sample
**Status:** APPROVED
**Scope:** One test case for the canonical-hash harness. Skills 4 and 5 assert the same golden hash on this pair of files.
**Generated:** 2026-09-27
**Review page language:** English — see TC-REVIEW-hash-sample.html
**Total test cases:** 1
**Smoke TCs:** 1
**Automation candidates:** 1
**Manual-only scenarios:** 0
**Tag convention:** regression
**Data items:** 1 — ready 1 · missing 0 · impossible 0 · unknown 0
**Accounts needed:** 1 — 1 confirmed · 0 unknown
**Environment rows:** 2 — 2 ready · 0 unknown
**Data checked in:** staging, 2026-09-27

## Summary
| ID | Type | Locale | Requirement | Stage | Smoke | Automation Candidate | Data effect | Shared data | Tags | Validation | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-HASH-01 | happy-path | en | REQ-9001-01 | @positive | YES | YES | read-only | — | regression | draft — not app-validated | Filter the product list by category |

## Test Cases

### TC-HASH-01 — Filter the product list by category
- **Type:** happy-path
- **Locale:** en
- **Requirement:** REQ-9001-01
- **Stage:** @positive
- **Preconditions:**
  1. Logged in as Administrator [A1]; page language English.
  2. Price list "Sample" [D1] exists with 12 products in the category "Hardware".
- **Steps:**
  1. Open the portal [E1] — the home page is visible.
  2. Open Products — the product list shows every product.
  3. Type "Hardware  2026" in the "Search" field and press Enter — the list reloads.
- **Expected Result:** The list shows exactly 12 rows and the message "12 products found" is displayed.
- **Data Oracle:** price list "Sample" [D1] — expected count: 12
- **Smoke:** YES
- **Automation Candidate:** YES
- **Data effect:** read-only
- **Shared data:** —
- **Tags:** regression
- **Validation:** draft — not app-validated
<!-- tc-evidence
validated-on: —
env: —
build: —
scope: —
content-sha256: —
req-sha256: —
open-questions: —
checked-in-run: —
-->

## Test Data

### 0. Environment
| ID | What | Value | Status |
|---|---|---|---|
| E1 | application base URL | https://portal.example.test | READY |
| E2 | mail sandbox (reads notification mail) | https://mail.example.test | READY |

### 1. Accounts
| ID | Role | Username | Status | Used by TCs | Note |
|---|---|---|---|---|---|
| A1 | Administrator | admin.user | READY | TC-HASH-01 | used for login in every TC |

### 2. Test data at a glance
| # | Data item (plain name) | Must look like | Used by TCs | Status | Best way to get it |
|---|---|---|---|---|---|
| D1 | Price list "Sample" with 12 products | 12 rows, category "Hardware" | TC-HASH-01 | READY | — |

### 3. Data item details
#### D1 — Price list "Sample" with 12 products
- **What it is:** the list the filter TC reads.
- **Exact values needed:** 12 products in the category "Hardware".
- **Used by:** TC-HASH-01
- **Where I checked:** listing screen "Products" seen live
- **Status:** READY — seen on staging 2026-09-27
- **Shared with other TCs:** no
