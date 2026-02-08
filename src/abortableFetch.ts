const FETCH_TIMEOUT = 15000; // 15 seconds

export type FetchResult<T> = { ok: true; data: T } | { ok: false; aborted: boolean };

let abortController: AbortController | null = null;

export async function abortableFetch<T>(url: string): Promise<FetchResult<T>> {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  const signal = AbortSignal.any([abortController.signal, AbortSignal.timeout(FETCH_TIMEOUT)]);

  try {
    const response = await fetch(url, { signal });
    const data: T = await response.json();
    return { ok: true, data };
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return { ok: false, aborted: true };
    }
    console.error('Fetch failed:', e);
    return { ok: false, aborted: false };
  }
}
