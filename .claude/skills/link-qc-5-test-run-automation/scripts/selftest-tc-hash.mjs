#!/usr/bin/env node
// selftest-tc-hash.mjs — regression harness for tc-hash.mjs (the canonical test-case hash).
//
// THIS SCRIPT EXITS NON-ZERO ON MISMATCH, ON PURPOSE. It is a test harness, not one of the
// read-only reporting scripts. A failing self-test means the `tc_hash` values this skill records
// per automated TC in the run file (the "automation written for TC version X" fingerprint that is
// compared across phases) cannot be trusted: do not record or compare them until it passes again.
//
// The fixture under fixtures/tc-hash/ (one TC document whose `## Test Data` section carries the
// referenced rows) is read with line endings normalised to LF, so the harness gives the same
// verdict on an LF or a CRLF checkout (core.autocrlf); case 11 asserts separately that CRLF never
// changes the hash, case 13 hashes a CRLF copy written to disk and case 15 derives the legacy
// pair (document without the section + separate TEST-DATA file) and expects the same hash.
// Run: node selftest-tc-hash.mjs [--pretty]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { hashDocument, parseTcDocument, parseTestData, hasInlineTestData, tcHash, canonicalTc, normText, HASH_VERSION } from './tc-hash.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FX = path.join(here, 'fixtures', 'tc-hash');
const TC_FILE = path.join(FX, 'TEST-CASES-hash-sample.md');
const ID = 'TC-HASH-01';
/** The one golden hash of TC-HASH-01 on this fixture. Regenerate ONLY for a deliberate tc-hash.mjs change. */
export const GOLDEN = '935858124e72e0dd04faac4bdcc7870cd70171fbb00cdf851033120ad7c79bb8';

/** Fixtures are normalised to LF so the mutation needles (written with \n) match on any checkout. */
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n?/g, '\n');
const TC_TEXT = read(TC_FILE);
const hashOf = (tcText = TC_TEXT, dataText = '') => hashDocument(tcText, dataText, [ID])[ID];
/** The legacy shape, derived from the fixture: the document without `## Test Data` + a separate TEST-DATA text whose tables sit under `##`. */
const DATA_START = TC_TEXT.indexOf('\n## Test Data');
if (DATA_START < 0) throw new Error('fixture has no ## Test Data section');
const TC_NO_DATA = TC_TEXT.slice(0, DATA_START + 1);
const LEGACY_DATA_TEXT = '# Test Data — hash-sample\n' + TC_TEXT.slice(DATA_START + '\n## Test Data\n'.length).replace(/^#### /gm, '### ').replace(/^### /gm, '## ');
const mustContain = (text, needle) => { if (!text.includes(needle)) throw new Error('fixture no longer contains: ' + needle); return text; };
const mutate = (text, from, to) => mustContain(text, from).replace(from, to);

const cases = []; const fail = [];
function check(name, problems, detail) { cases.push({ case: name, ok: problems.length === 0, problems, detail }); if (problems.length) fail.push({ case: name, problems }); }
const expectSame = (p, label, h) => { if (h.hash !== GOLDEN) p.push(label + ': hash changed although the behaviour did not (' + h.hash.slice(0, 12) + ')'); };
const expectDifferent = (p, label, h) => { if (h.hash === GOLDEN) p.push(label + ': hash did NOT change although the behaviour did'); };

/* 0 — the golden hash on the fixture; the referenced rows come from the document's own `## Test Data` section. */
{
  const p = [];
  const h = hashOf();
  if (!h) p.push(ID + ' not parsed from the fixture');
  if (!hasInlineTestData(TC_TEXT)) p.push('hasInlineTestData does not see the ## Test Data section');
  else if (h.hash !== GOLDEN) p.push('golden mismatch: ' + h.hash + ' (expected ' + GOLDEN + ') — regenerate ONLY for a deliberate tc-hash.mjs change');
  if (h && !h.canonical.startsWith(HASH_VERSION + '\nid=' + ID)) p.push('canonical form does not start with the version line');
  if (h && !/data=A1=Administrator\|[^;]*;D1=[^;]*;E1=application base URL$/.test(h.canonical)) p.push('data fingerprint does not carry role / item / what only: ' + h.canonical.split('\n').pop());
  if (h && /admin\.user|portal\.example|READY/.test(h.canonical)) p.push('a username, an environment value or a status leaked into the canonical form');
  check('0 golden hash on the fixture', p, { hash: h && h.hash });
}

/* 1 — formatting-only edits outside quotes: bold, extra spaces, renumbered steps → same hash. */
{
  const p = [];
  let t = mutate(TC_TEXT, '  1. Open the portal [E1] — the home page is visible.', '  4. Open   the **portal** [E1] —  the home page is  visible.');
  t = mutate(t, '  2. Open Products — the product list shows every product.', '  7. Open _Products_ — the product list shows every product.');
  t = mutate(t, '- **Expected Result:** The list shows exactly 12 rows', '- **Expected Result:**   The list   shows exactly 12 rows');
  expectSame(p, 'bold / spaces / renumbering', hashOf(t));
  if (normText('Open   the **portal** [E1]') !== 'Open the portal [E1]') p.push('normText does not strip emphasis and collapse whitespace outside quotes');
  check('1 formatting-only edit → same hash', p, {});
}

/* 2 — whitespace INSIDE a quoted typed input is meaningful: "Hardware  2026" → "Hardware 2026" → different. */
{
  const p = [];
  expectDifferent(p, 'quoted double space collapsed', hashOf(mutate(TC_TEXT, '"Hardware  2026"', '"Hardware 2026"')));
  if (normText('Type "a  b" now') !== 'Type "a  b" now') p.push('normText altered whitespace inside quotes');
  check('2 quoted input whitespace → different hash', p, {});
}

/* 3 — the expected message text changed inside quotes → different. */
{
  const p = [];
  expectDifferent(p, 'expected message', hashOf(mutate(TC_TEXT, '"12 products found"', '"12 products were found"')));
  check('3 expected message changed → different hash', p, {});
}

/* 4 — D-row "Must look like" changed → different (the referenced data shape is part of the behaviour). */
{
  const p = [];
  expectDifferent(p, 'D1 must-look-like', hashOf(mutate(TC_TEXT, '12 rows, category "Hardware"', '24 rows, category "Hardware"')));
  check('4 D-row Must look like changed → different hash', p, {});
}

/* 5 — A-row role changed → different; 6 — A-row username changed → same. */
{
  const p = [];
  expectDifferent(p, 'A1 role', hashOf(mutate(TC_TEXT, '| A1 | Administrator | admin.user |', '| A1 | Auditor | admin.user |')));
  expectSame(p, 'A1 username', hashOf(mutate(TC_TEXT, '| A1 | Administrator | admin.user |', '| A1 | Administrator | other.person |')));
  check('5+6 account role changes the hash, the username does not', p, {});
}

/* 7 — E-row URL changed → same (routine environment); the E-row "What" changed → different. */
{
  const p = [];
  expectSame(p, 'E1 value', hashOf(mutate(TC_TEXT, 'https://portal.example.test', 'https://portal-uat.example.test')));
  expectDifferent(p, 'E1 what', hashOf(mutate(TC_TEXT, '| E1 | application base URL |', '| E1 | admin portal base URL |')));
  check('7 environment URL does not change the hash, the kind of service does', p, {});
}

/* 8 — Shared data changed → different. */
{
  const p = [];
  expectDifferent(p, 'Shared data', hashOf(mutate(TC_TEXT, '- **Shared data:** —', '- **Shared data:** price list "Sample" [D1]')));
  check('8 Shared data changed → different hash', p, {});
}

/* 9 — Validation, the evidence stamp and Tags are excluded: changing them → same hash. */
{
  const p = [];
  expectSame(p, 'Validation', hashOf(mutate(TC_TEXT, '- **Validation:** draft — not app-validated', '- **Validation:** validated')));
  expectSame(p, 'evidence stamp', hashOf(mutate(TC_TEXT, 'validated-on: —\nenv: —', 'validated-on: 2026-09-27\nenv: staging')));
  expectSame(p, 'Tags', hashOf(mutate(TC_TEXT, '- **Tags:** regression', '- **Tags:** regression, uat')));
  expectSame(p, 'Smoke / Automation Candidate / Description', hashOf(mutate(mutate(TC_TEXT, '- **Smoke:** YES', '- **Smoke:** NO'), '### TC-HASH-01 — Filter the product list by category', '### TC-HASH-01 — Filter products by category')));
  check('9 Validation / evidence stamp / Tags / Smoke / heading → same hash', p, {});
}

/* 10 — an unresolved reference is fingerprinted as "?" so the gap stays visible, and changes the hash. */
{
  const p = [];
  const h = hashOf(mutate(TC_TEXT, 'Logged in as Administrator [A1]', 'Logged in as Administrator [A9]'));
  expectDifferent(p, 'unresolved [A9]', h);
  if (!/A9=\?/.test(h.canonical)) p.push('unresolved reference not fingerprinted as ?');
  const noData = hashDocument(TC_NO_DATA, '', [ID])[ID];
  if (!/A1=\?;D1=\?;E1=\?/.test(noData.canonical)) p.push('a document without ## Test Data and without a legacy file must fingerprint every reference as ?');
  check('10 unresolved reference stays visible', p, {});
}

/* 11 — parsers: fields by name, never by position; PB-/Q- headings skipped; hashing is deterministic. */
{
  const p = [];
  const tcs = parseTcDocument(TC_TEXT + '\n### PB-1 — a potential bug\n- **Steps:** none\n### Q-1 — a question\n');
  if (tcs.length !== 1 || tcs[0].id !== ID) p.push('parseTcDocument returned ' + tcs.map((t) => t.id).join(','));
  const d = parseTestData(TC_TEXT);
  if (!d.env.E1 || !d.env.E2 || !d.accounts.A1 || !d.items.D1) p.push('parseTestData missed a row of ## Test Data: ' + JSON.stringify(Object.keys(d.env)) + JSON.stringify(Object.keys(d.accounts)) + JSON.stringify(Object.keys(d.items)));
  const reordered = mutate(TC_TEXT, '- **Locale:** en\n- **Requirement:** REQ-9001-01', '- **Requirement:** REQ-9001-01\n- **Locale:** en');
  expectSame(p, 'field order', hashOf(reordered));
  if (tcHash(tcs[0], d) !== tcHash(tcs[0], d) || canonicalTc(tcs[0], d) !== canonicalTc(tcs[0], d)) p.push('hashing is not deterministic');
  const crlf = hashDocument(TC_TEXT.replace(/\n/g, '\r\n'), '', [ID])[ID];
  if (crlf.hash !== GOLDEN) p.push('CRLF line endings changed the hash');
  check('11 parsers and determinism', p, {});
}

/* 12 — CLI: --tc alone reads the inline test data (payload.data = "inline"); --ids filters; --canonical expands; no --tc → NOT_RUN, exit 0. */
{
  const p = [];
  const script = path.join(here, 'tc-hash.mjs');
  const call = (args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', cwd: here });
  const r1 = call(['--tc', TC_FILE, '--ids', ID]);
  let j1; try { j1 = JSON.parse(r1.stdout); } catch { p.push('stdout is not a single JSON object'); }
  if (r1.status !== 0) p.push('exit ' + r1.status + ' != 0');
  if (j1 && (j1.gate !== 'PASS' || j1.hashes[ID] !== GOLDEN || j1.count !== 1)) p.push('CLI payload wrong: ' + JSON.stringify(j1 && { gate: j1.gate, count: j1.count, hash: j1.hashes && j1.hashes[ID] }));
  if (j1 && j1.data !== 'inline') p.push('the inline ## Test Data section was not reported as the data source: ' + j1.data);
  const r2 = JSON.parse(call(['--tc', TC_FILE, '--canonical']).stdout);
  if (!r2.hashes[ID] || r2.hashes[ID].hash !== GOLDEN || !r2.hashes[ID].canonical) p.push('--canonical did not return hash + canonical');
  const r3 = call([]); const j3 = JSON.parse(r3.stdout);
  if (r3.status !== 0 || j3.gate !== 'NOT_RUN') p.push('missing --tc must be NOT_RUN with exit 0, got ' + j3.gate + ' / ' + r3.status);
  const r4 = JSON.parse(call(['--tc', path.join(FX, 'missing.md')]).stdout);
  if (r4.gate !== 'NOT_RUN') p.push('missing file must be NOT_RUN');
  check('12 CLI', p, {});
}

/* 13 — line endings of the fixture on disk: a CRLF copy gives the same hash and CLI payload as the LF fixture. */
{
  const p = [];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-hash-crlf-'));
  try {
    const tc = path.join(dir, 'TEST-CASES-hash-sample.md');
    fs.writeFileSync(tc, TC_TEXT.replace(/\n/g, '\r\n'));
    const r = spawnSync(process.execPath, [path.join(here, 'tc-hash.mjs'), '--tc', tc, '--ids', ID], { encoding: 'utf8' });
    let j; try { j = JSON.parse(r.stdout); } catch { p.push('CLI on a CRLF copy did not print JSON'); }
    if (j && (j.gate !== 'PASS' || j.hashes[ID] !== GOLDEN)) p.push('CRLF copy on disk hashes differently: ' + JSON.stringify(j && { gate: j.gate, hash: j.hashes && j.hashes[ID] }));
    if (!TC_TEXT.includes('validated-on: —\nenv: —')) p.push('normalised fixture text lost the LF join the mutation needles rely on');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  check('13 CRLF fixture on disk → same hash and payload', p, {});
}

/* 14 — a reviewer's `Reviewer comment` field (shown on the rendered pages, read by the skills) never changes a TC hash. */
{
  const p = [];
  const withNote = TC_TEXT.replace(/\r?\n(- \*\*Validation:\*\*[^\r\n]*)/, '\n$1\n- **Reviewer comment:** Step 2 should name the grid.');
  if (withNote === TC_TEXT) p.push('fixture has no Validation line to anchor the comment');
  if (hashOf(withNote).hash !== hashOf().hash) p.push('a Reviewer comment field changed the hash');
  check('14 a Reviewer comment never changes the hash', p, {});
}

/* 15 — legacy shape: a document without `## Test Data` + a separate TEST-DATA file (tables under `##`) gives the same hash;
        the CLI finds that file by name, and ignores it once the document carries the section. */
{
  const p = [];
  const legacy = hashDocument(TC_NO_DATA, LEGACY_DATA_TEXT, [ID])[ID];
  if (!legacy || legacy.hash !== GOLDEN) p.push('legacy pair hashes differently: ' + (legacy && legacy.hash));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-hash-legacy-'));
  try {
    const tc = path.join(dir, 'TEST-CASES-hash-sample.md'); const data = path.join(dir, 'TEST-DATA-hash-sample.md');
    fs.writeFileSync(tc, TC_NO_DATA); fs.writeFileSync(data, LEGACY_DATA_TEXT);
    const call = (args) => JSON.parse(spawnSync(process.execPath, [path.join(here, 'tc-hash.mjs'), ...args], { encoding: 'utf8' }).stdout);
    const j1 = call(['--tc', tc, '--ids', ID]);
    if (j1.gate !== 'PASS' || j1.hashes[ID] !== GOLDEN) p.push('CLI on the legacy pair hashes differently: ' + JSON.stringify({ gate: j1.gate, hash: j1.hashes && j1.hashes[ID] }));
    if (!/TEST-DATA-hash-sample\.md$/.test(String(j1.data))) p.push('the legacy TEST-DATA file was not found by name: ' + j1.data);
    fs.writeFileSync(data, LEGACY_DATA_TEXT.replace('| A1 | Administrator |', '| A1 | Auditor |'));
    const j2 = call(['--tc', TC_FILE, '--data', data, '--ids', ID]);
    if (j2.data !== 'inline' || j2.hashes[ID] !== GOLDEN) p.push('a --data file must be ignored when the document carries ## Test Data: ' + JSON.stringify({ data: j2.data, hash: j2.hashes && j2.hashes[ID] }));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  check('15 legacy separate TEST-DATA file → same hash; ignored once the section is inline', p, {});
}

const out = {
  tool: 'selftest-tc-hash',
  skill: path.basename(path.resolve(here, '..')),
  golden: GOLDEN,
  ran: cases.length,
  ok: fail.length === 0,
  cases,
  mismatches: fail,
  note: fail.length ? 'tc-hash.mjs disagrees with its own fixture. Do not record or compare tc_hash values until this passes.' : 'All fixtures behave as documented.',
};
process.stdout.write(JSON.stringify(out, null, process.argv.includes('--pretty') ? 2 : 0) + '\n');
process.exit(fail.length ? 1 : 0);
