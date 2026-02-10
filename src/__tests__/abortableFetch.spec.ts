import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { abortableFetch } from '../abortableFetch';

describe('abortableFetch', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns success with parsed JSON data', async () => {
    const data = [{ id: 1 }];
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve(data),
    });

    const result = await abortableFetch('https://example.com/api');

    expect(result).toEqual({ ok: true, data });
  });

  it('passes an AbortSignal to fetch', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    await abortableFetch('https://example.com/api');

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(fetchCall[1]).toHaveProperty('signal');
    expect(fetchCall[1].signal).toBeInstanceOf(AbortSignal);
  });

  it('returns aborted result when fetch throws AbortError', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(abortError);

    const result = await abortableFetch('https://example.com/api');

    expect(result).toEqual({ ok: false, aborted: true });
  });

  it('returns error result and logs when fetch throws a network error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await abortableFetch('https://example.com/api');

    expect(result).toEqual({ ok: false, aborted: false });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('returns error result when fetch throws TimeoutError', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const timeoutError = new DOMException('Signal timed out.', 'TimeoutError');
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(timeoutError);

    const result = await abortableFetch('https://example.com/api');

    expect(result).toEqual({ ok: false, aborted: false });
    expect(consoleSpy).toHaveBeenCalledWith('Fetch failed:', timeoutError);
  });

  it('aborts the previous in-flight request when called again', async () => {
    const freshData = [{ id: 2 }];
    let callCount = 0;

    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      (_url: string, options?: { signal?: AbortSignal }) => {
        callCount++;
        if (callCount === 1) {
          return new Promise((_resolve, reject) => {
            options?.signal?.addEventListener('abort', () => {
              reject(new DOMException('The operation was aborted.', 'AbortError'));
            });
          });
        }
        return Promise.resolve({ json: () => Promise.resolve(freshData) });
      },
    );

    const firstCall = abortableFetch('https://example.com/api');
    const secondCall = abortableFetch('https://example.com/api');

    const [firstResult, secondResult] = await Promise.all([firstCall, secondCall]);

    expect(firstResult).toEqual({ ok: false, aborted: true });
    expect(secondResult).toEqual({ ok: true, data: freshData });
  });
});
