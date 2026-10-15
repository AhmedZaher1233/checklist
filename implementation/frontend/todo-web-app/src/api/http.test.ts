import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, REQUEST_TIMEOUT_MS, isNotFound, request } from './http';

function jsonResponse(status: number, body: unknown, contentType = 'application/json') {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': contentType } });
}

describe('request (T009)', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('returns the parsed body and uses a relative URL with JSON headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, [{ id: '1' }]));
    vi.stubGlobal('fetch', fetchMock);

    await expect(request('/api/v1/tasks')).resolves.toEqual([{ id: '1' }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/tasks');
  });

  it('sends a JSON body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(201, { id: '1' }));
    vi.stubGlobal('fetch', fetchMock);

    await request('/api/v1/tasks', { method: 'POST', body: { title: 'Buy milk' } });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"title":"Buy milk"}');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('returns undefined for 204', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(request('/api/v1/tasks/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('turns a problem response into an ApiError with type and field errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          400,
          { type: '/problems/validation', status: 400, errors: [{ field: 'title', code: 'required' }] },
          'application/problem+json',
        ),
      ),
    );

    const error = await request('/api/v1/tasks', { method: 'POST', body: {} }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      kind: 'problem',
      status: 400,
      type: '/problems/validation',
      fieldErrors: [{ field: 'title', code: 'required' }],
    });
  });

  it('recognises a task that no longer exists', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(404, { type: '/problems/task-not-found' }, 'application/problem+json')),
    );
    const error = await request('/api/v1/tasks/1', { method: 'DELETE' }).catch((e: unknown) => e);
    expect(isNotFound(error)).toBe(true);
  });

  it('reports a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(request('/api/v1/tasks')).rejects.toMatchObject({ kind: 'network' });
  });

  it('gives up after 10 seconds and never retries', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const assertion = expect(request('/api/v1/tasks')).rejects.toMatchObject({ kind: 'timeout' });
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports a cancelled request as aborted', async () => {
    const fetchMock = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();

    const assertion = expect(request('/api/v1/tasks', { signal: controller.signal })).rejects.toMatchObject({
      kind: 'aborted',
    });
    controller.abort();
    await assertion;
  });
});
