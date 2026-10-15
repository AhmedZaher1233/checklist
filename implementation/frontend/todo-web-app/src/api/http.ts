/**
 * The only place that talks HTTP (architecture/cross-cutting/code-structure.md, rule 4): relative URLs, a 10-second
 * timeout, problem+json errors turned into ApiError, and no automatic retries (resilience.md, rules 1 and 2).
 */

export const REQUEST_TIMEOUT_MS = 10_000;

export interface FieldError {
  field: string;
  code: string;
  message?: string;
}

export type ApiErrorKind = 'problem' | 'network' | 'timeout' | 'aborted';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly type?: string;
  readonly fieldErrors: FieldError[];

  constructor(kind: ApiErrorKind, status?: number, type?: string, fieldErrors: FieldError[] = []) {
    super(`Request failed: ${kind}${status ? ` ${status}` : ''}`);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.type = type;
    this.fieldErrors = fieldErrors;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, timeoutMs = REQUEST_TIMEOUT_MS } = options;
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const forwardAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', forwardAbort, { once: true });
    }
  }

  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers:
        body === undefined
          ? { Accept: 'application/json' }
          : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    if (timedOut) {
      throw new ApiError('timeout');
    }
    if (signal?.aborted) {
      throw new ApiError('aborted');
    }
    throw new ApiError('network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

async function toApiError(response: Response): Promise<ApiError> {
  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('json')) {
    try {
      const problem = (await response.json()) as { type?: string; errors?: FieldError[] };
      return new ApiError('problem', response.status, problem.type, problem.errors ?? []);
    } catch {
      // fall through: a body that is not valid JSON is treated as a bare status
    }
  }
  return new ApiError('problem', response.status);
}

/** True when the task the request named no longer exists (for example someone else deleted it). */
export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.kind === 'problem' && error.status === 404;
}

/** True when the request was cancelled on purpose (component unmounted); never shown to the user. */
export function isAborted(error: unknown): boolean {
  return error instanceof ApiError && error.kind === 'aborted';
}
