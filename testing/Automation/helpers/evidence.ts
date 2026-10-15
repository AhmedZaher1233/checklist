// helpers/evidence.ts — the assertion-point evidence image (skill 5, <result_organization>).
//
//   captureEvidence(page, testInfo)        — called ONCE in the test body, right before the last assertion
//   recordFailureEvidence(page, testInfo)  — called from afterEach; only acts when the test failed
//
// Images go to {PW_SCREENSHOTS_ROOT}/phase-{PW_PHASE}/{TC-ID}/{variant_slug}/attempt-{a}.png (and
// attempt-{a}-failed.png on failure). An existing file is NEVER overwritten: the attempt number is
// the next free one, so re-runs, heals and earlier phases stay intact.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import { tcIdsOf } from './steps';

const attemptByTest = new Map<string, number>();

function screenshotsRoot(): string {
  return resolve(process.env.PW_SCREENSHOTS_ROOT ?? 'screenshots/unassigned');
}

function phaseDir(): string {
  return join(screenshotsRoot(), `phase-${process.env.PW_PHASE ?? '0'}`);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'none';
}

/** `{project}--{data-variation}--r{repeat}`; a variation is the label after " — variation " in the title. */
export function variantSlug(testInfo: TestInfo): string {
  const variation = /— variation (.+?)(?: @|$)/.exec(testInfo.title)?.[1];
  return `${testInfo.project.name}--${variation ? slug(variation) : 'none'}--r${testInfo.repeatEachIndex}`;
}

function variantDir(tcId: string, testInfo: TestInfo): string {
  return join(phaseDir(), tcId, variantSlug(testInfo));
}

/** Next attempt number whose image does not exist yet for ANY of the test's TC-IDs. */
function nextFreeAttempt(tcIds: string[], testInfo: TestInfo): number {
  let attempt = 1;
  while (tcIds.some((tc) => existsSync(join(variantDir(tc, testInfo), `attempt-${attempt}.png`)))) attempt++;
  return attempt;
}

function recordVariant(testInfo: TestInfo): void {
  const file = join(phaseDir(), 'variants.json');
  try {
    mkdirSync(dirname(file), { recursive: true });
    const map: Record<string, unknown> = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
    const key = variantSlug(testInfo);
    const entry = { title: testInfo.titlePath.join(' › '), project: testInfo.project.name, file: testInfo.file };
    const list = (map[key] as unknown[] | undefined) ?? [];
    if (!list.some((e) => JSON.stringify(e) === JSON.stringify(entry))) list.push(entry);
    map[key] = list;
    writeFileSync(file, JSON.stringify(map, null, 2));
  } catch {
    appendFileSync(join(phaseDir(), 'variants.log'), `${variantSlug(testInfo)}\t${testInfo.title}\n`);
  }
}

async function writeImage(page: Page, tcIds: string[], testInfo: TestInfo, name: string): Promise<void> {
  const image = await page.screenshot({ fullPage: true });
  for (const tc of tcIds) {
    const target = join(variantDir(tc, testInfo), name);
    if (existsSync(target)) continue; // never overwrite evidence
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, image);
  }
}

/** The assertion-point image: the screen the TC's Expected Result describes, before any teardown. */
export async function captureEvidence(page: Page, testInfo: TestInfo): Promise<void> {
  const tcIds = tcIdsOf(testInfo.title);
  if (!tcIds.length) return;
  const attempt = nextFreeAttempt(tcIds, testInfo);
  attemptByTest.set(testInfo.testId, attempt);
  await writeImage(page, tcIds, testInfo, `attempt-${attempt}.png`);
  recordVariant(testInfo);
}

/** afterEach: on failure, keep the failing screen; an attempt that never reached captureEvidence still gets its image. */
export async function recordFailureEvidence(fixturePage: Page, testInfo: TestInfo): Promise<void> {
  // a case that "reopens the application in a new window" closed the fixture page: use its newest open window
  const page = fixturePage.isClosed()
    ? fixturePage.context().pages().filter((candidate) => !candidate.isClosed()).at(-1)
    : fixturePage;
  if (testInfo.status === testInfo.expectedStatus || !page) {
    attemptByTest.delete(testInfo.testId);
    return;
  }
  const tcIds = tcIdsOf(testInfo.title);
  if (!tcIds.length) return;
  try {
    let attempt = attemptByTest.get(testInfo.testId);
    if (attempt === undefined) {
      attempt = nextFreeAttempt(tcIds, testInfo);
      await writeImage(page, tcIds, testInfo, `attempt-${attempt}.png`);
    }
    await writeImage(page, tcIds, testInfo, `attempt-${attempt}-failed.png`);
    recordVariant(testInfo);
  } catch {
    /* evidence never fails a test */
  } finally {
    attemptByTest.delete(testInfo.testId);
  }
}
