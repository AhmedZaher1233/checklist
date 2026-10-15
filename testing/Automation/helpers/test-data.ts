// helpers/test-data.ts — unique test data per phase, worker, retry and run, and the per-ID
// resolution of the ## Test Data references a TC carries (skill 5, references/code-craft.md §7).
//
// PART 1 — unique names. Every record a test CREATES carries a name built here, so two workers, a
// retry, a repeat-each variant or a re-run of the same phase never collide, and cleanup can select
// everything a test created by its own prefix.
//
// PART 2 — per-ID resolution. Every ID resolves to ITS OWN row of the ## Test Data section of
// specs/001-todo-list/TEST-CASES-001-todo-list.md, through environment variables named after the ID.
// This story has one environment row (E1) and no accounts (no sign-in, FR-015).
import { test, type TestInfo } from '@playwright/test';

const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

function shortRandom(length = 4): string {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

/** The phase this run belongs to — set per stage command by the skill (PW_PHASE); `0` outside a skill run. */
export function phase(): string {
  return process.env.PW_PHASE ?? '0';
}

/** Prefix shared by everything THIS phase creates under `prefix` — the key for cleanup sweeps. */
export function runPrefix(prefix: string): string {
  return `${prefix}-p${phase()}-`;
}

/** `{prefix}-p{phase}-w{worker}-r{retry}-{4 random}` — unique across workers, retries, repeats and re-runs. */
export function uniqueName(prefix: string, info: TestInfo = test.info()): string {
  const repeat = info.repeatEachIndex ? `-e${info.repeatEachIndex}` : '';
  return `${runPrefix(prefix)}w${info.parallelIndex}-r${info.retry}${repeat}-${shortRandom()}`;
}

/* ---------------- per-ID resolution of ## Test Data references ---------------- */

/** An environment row `[E{n}]` — the `What` column says which service it is. */
export type EnvironmentEntry = { id: string; what: string; url: string };

function required(name: string, id: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`test-data: environment variable ${name} is not set — it holds the value of [${id}] from the ## Test Data section`);
  return value;
}

/** Environment entries keyed by E-ID; the URL comes from `{ID}_URL` at run time — never a literal here. */
export const environments: Record<string, () => EnvironmentEntry> = {
  E1: () => ({ id: 'E1', what: 'application base URL — local build (web app dev server)', url: required('E1_URL', 'E1') }),
};

/** `[E{n}]` → its own environment entry. Unknown ID → throws. */
export function environment(id: string): EnvironmentEntry {
  const entry = environments[id.toUpperCase()];
  if (!entry) throw new Error(`test-data: no environment entry for [${id}] — add the ## 0. Environment row to helpers/test-data.ts`);
  return entry();
}

/**
 * Data items keyed by D-ID ([D1] empty list, [D2] tasks owned by the case, [D3] long titles).
 * [D1] is prepared by the `emptyTaskList` fixture; [D2] by the case through the page; [D3] below.
 */
export const dataItems = {
  /** [D3] the 100-character title: the case's run prefix followed by "A" up to 100 characters. */
  hundredCharacterTitle(run: string): string {
    return `${run}-`.padEnd(100, 'A');
  },
  /** [D3] the 120-character title: the case's run prefix followed by "P" up to 120 characters. */
  hundredTwentyCharacterTitle(run: string): string {
    return `${run}-`.padEnd(120, 'P');
  },
};
