// utils/env.ts — the env layer of the acceptance automation.
// Reads the git-ignored .env next to playwright.config.ts into process.env (never overriding a value
// already set by the shell or CI). No URL or credential is written in code.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(__dirname, '..', '.env');
if (existsSync(file)) {
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (match && !line.trimStart().startsWith('#') && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2];
    }
  }
}

export const env = {
  /** [E1] application base URL — from E1_URL; undefined when not configured (test-data.ts throws on use). */
  baseURL: process.env.E1_URL,
};
