# tc-hash fixture

`TEST-CASES-hash-sample.md`: one test case (`TC-HASH-01`) that references an account (`[A1]`), an
environment row (`[E1]`) and a data item (`[D1]`) — all three rows live in the document's own
`## Test Data` section (`### 0. Environment`, `### 1. Accounts`, `### 2. Test data at a glance`) —
a quoted typed input with a double space (`"Hardware  2026"`) and a quoted expected message.
`selftest-tc-hash.mjs` asserts ONE golden hash for this document and the canonical-hash rules
(formatting-only edits → same hash; a changed quoted value, referenced-data shape, account role or
`Shared data` → different hash; username, URL, Validation, evidence stamp, Tags → same hash). Case 15
derives a legacy pair (document without the section + separate TEST-DATA file) from the same text
and asserts the same hash, so old feature folders keep their `tc_hash` values.

The harness reads the file with line endings normalised to LF, so an LF or a CRLF checkout gives
the same verdict; case 13 also hashes a CRLF copy written to disk. Regenerate the golden constant
only for a deliberate change of `tc-hash.mjs`
(`node scripts/tc-hash.mjs --tc scripts/fixtures/tc-hash/TEST-CASES-hash-sample.md --pretty`).
