import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { withSetup } from './testHelper';
import { useAppointmentSearch } from '../useAppointmentSearch';
import type { ApiAvailableSlots } from '../../apiTypes';

vi.mock('../../notificationsBuilder', () => ({
  createNotification: vi.fn(),
}));

function makeSlot(startTimestamp = '2024-01-15T10:30'): ApiAvailableSlots {
  return {
    locationId: 5446,
    startTimestamp,
    endTimestamp: '2024-01-15T10:45',
    active: true,
    duration: 15,
    remoteInd: false,
  };
}

function mockFetchResponse(body: unknown, ok = true) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(body),
  });
}

describe('useAppointmentSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts with empty appointments', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.appointments.value).toEqual([]);
    });

    it('starts with auto-retry enabled', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.shouldAutoRetry.value).toBe(true);
    });

    it('starts with no active search', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.activeSearch.value).toBe(false);
    });

    it('starts with didFirstSearch as false', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.didFirstSearch.value).toBe(false);
    });

    it('starts with default location ID 5446', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.locationId.value).toBe(5446);
    });
  });

  describe('computed properties', () => {
    it('lastSearchDate returns "--" when no search has been performed', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.lastSearchDate.value).toBe('--');
    });

    it('hasAvailableAppointments reflects appointments length', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.hasAvailableAppointments.value).toBe(false);

      result.appointments.value = [makeSlot()];
      expect(result.hasAvailableAppointments.value).toBe(true);
    });

    it('searchButtonText shows "Search" when idle and "Searching..." when active', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.searchButtonText.value).toBe('Search');

      result.activeSearch.value = true;
      expect(result.searchButtonText.value).toBe('Searching...');
    });

    it('searchButtonClass returns "secondary" when actively searching', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      expect(result.searchButtonClass.value).toBe('');

      result.activeSearch.value = true;
      expect(result.searchButtonClass.value).toBe('secondary');
    });
  });

  describe('fetchData', () => {
    it('fetches from the CBP API with the current location ID', async () => {
      mockFetchResponse([]);
      const [result] = withSetup(() => useAppointmentSearch());
      result.shouldAutoRetry.value = false;

      await result.fetchData();
      await flushPromises();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=1000&locationId=5446&minimum=1',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('updates appointments on successful fetch', async () => {
      const slots = [makeSlot()];
      mockFetchResponse(slots);
      const [result] = withSetup(() => useAppointmentSearch());
      result.shouldAutoRetry.value = false;

      await result.fetchData();
      await flushPromises();

      expect(result.appointments.value).toEqual(slots);
      expect(result.didFirstSearch.value).toBe(true);
      expect(result.activeSearch.value).toBe(false);
      expect(result.lastSearched.value).toBeInstanceOf(Date);
    });

    it('sets fetchError on network failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));
      const [result] = withSetup(() => useAppointmentSearch());
      result.shouldAutoRetry.value = false;

      await result.fetchData();
      await flushPromises();

      expect(result.fetchError.value).toBe('Network error');
      expect(result.appointments.value).toEqual([]);
    });

    it('sets fetchError on non-ok response', async () => {
      mockFetchResponse(null, false);
      const [result] = withSetup(() => useAppointmentSearch());
      result.shouldAutoRetry.value = false;

      await result.fetchData();
      await flushPromises();

      expect(result.fetchError.value).toBe('Request failed (HTTP 500)');
    });

    it('schedules auto-retry after successful fetch', async () => {
      mockFetchResponse([]);
      const [result] = withSetup(() => useAppointmentSearch());
      result.shouldAutoRetry.value = true;

      await result.fetchData();
      await flushPromises();

      expect(result.currentTimeoutIntervalId.value).not.toBeNull();
    });

    it('sends notification when appointments found and notifications enabled', async () => {
      const { createNotification } = await import('../../notificationsBuilder');
      vi.mocked(createNotification).mockClear();
      const slots = [makeSlot()];
      mockFetchResponse(slots);

      const [result] = withSetup(() => useAppointmentSearch());
      result.notificationsEnabled.value = true;
      result.shouldAutoRetry.value = false;

      await result.fetchData();
      await flushPromises();

      expect(createNotification).toHaveBeenCalledWith(slots);
    });

    it('does not send notification when notifications are disabled', async () => {
      const { createNotification } = await import('../../notificationsBuilder');
      vi.mocked(createNotification).mockClear();
      mockFetchResponse([makeSlot()]);

      const [result] = withSetup(() => useAppointmentSearch());
      result.notificationsEnabled.value = false;
      result.shouldAutoRetry.value = false;

      await result.fetchData();
      await flushPromises();

      expect(createNotification).not.toHaveBeenCalled();
    });
  });

  describe('changeAutoRetry', () => {
    it('clears timeout when auto-retry is disabled', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      result.currentTimeoutIntervalId.value = 456;
      result.shouldAutoRetry.value = false;

      result.changeAutoRetry();

      expect(result.currentTimeoutIntervalId.value).toBeNull();
    });

    it('preserves timeout when auto-retry is enabled', () => {
      const [result] = withSetup(() => useAppointmentSearch());
      result.currentTimeoutIntervalId.value = 456;
      result.shouldAutoRetry.value = true;

      result.changeAutoRetry();

      expect(result.currentTimeoutIntervalId.value).toBe(456);
    });
  });

  describe('clearFetchDataTimeout', () => {
    it('clears existing timeout', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const [result] = withSetup(() => useAppointmentSearch());
      result.currentTimeoutIntervalId.value = 123;

      result.clearFetchDataTimeout();

      expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
      expect(result.currentTimeoutIntervalId.value).toBeNull();
    });

    it('does nothing when no timeout is set', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const [result] = withSetup(() => useAppointmentSearch());

      result.clearFetchDataTimeout();

      expect(clearTimeoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('cleanup on unmount', () => {
    it('clears timeout and aborts fetch on unmount', async () => {
      mockFetchResponse([]);
      const [result, app] = withSetup(() => useAppointmentSearch());
      result.shouldAutoRetry.value = true;

      await result.fetchData();
      await flushPromises();

      expect(result.currentTimeoutIntervalId.value).not.toBeNull();

      app.unmount();

      expect(result.currentTimeoutIntervalId.value).toBeNull();
    });
  });
});
