import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import App from '../App.vue';
import type { ApiAvailableSlots } from '../apiTypes';

vi.mock('../notificationsBuilder', () => ({
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

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function mountApp(notificationsEnabled = false) {
    return shallowMount(App, {
      global: {
        stubs: {
          LocationsSelector: {
            template: '<div></div>',
            data() {
              return { currentLocationId: 5446 };
            },
          },
          NotificationCheckbox: {
            template: '<div></div>',
            data() {
              return { notificationsEnabled };
            },
          },
          AvailableAppointmentsList: true,
          IconHelpTooltip: true,
          PageFooter: true,
        },
      },
    });
  }

  describe('initial state', () => {
    it('has empty appointments array', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.appointments).toEqual([]);
    });

    it('has shouldAutoRetry set to true', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.shouldAutoRetry).toBe(true);
    });

    it('has lastSearched set to null', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.lastSearched).toBeNull();
    });

    it('has didFirstSearch set to false', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.didFirstSearch).toBe(false);
    });

    it('has activeSearch set to false', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.activeSearch).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('lastSearchDate returns "--" when lastSearched is null', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.lastSearchDate).toBe('--');
    });

    it('lastSearchDate returns formatted date when lastSearched is set', () => {
      const wrapper = mountApp();
      wrapper.vm.lastSearched = new Date('2024-01-15T10:30:00');
      expect(wrapper.vm.lastSearchDate).not.toBe('--');
      expect(wrapper.vm.lastSearchDate).toBeTruthy();
    });

    it('hasAvailableAppointments returns false when appointments is empty', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.hasAvailableAppointments).toBe(false);
    });

    it('hasAvailableAppointments returns true when appointments exist', () => {
      const wrapper = mountApp();
      wrapper.vm.appointments = [makeSlot()];
      expect(wrapper.vm.hasAvailableAppointments).toBe(true);
    });

    it('searchButtonClass returns empty string when not actively searching', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.searchButtonClass).toBe('');
    });

    it('searchButtonClass returns "secondary" when actively searching', () => {
      const wrapper = mountApp();
      wrapper.vm.activeSearch = true;
      expect(wrapper.vm.searchButtonClass).toBe('secondary');
    });

    it('searchButtonText returns "Search" when not actively searching', () => {
      const wrapper = mountApp();
      expect(wrapper.vm.searchButtonText).toBe('Search');
    });

    it('searchButtonText returns "Searching..." when actively searching', () => {
      const wrapper = mountApp();
      wrapper.vm.activeSearch = true;
      expect(wrapper.vm.searchButtonText).toBe('Searching...');
    });
  });

  describe('clearFetchDataTimeout', () => {
    it('clears the timeout when one is set', () => {
      const wrapper = mountApp();
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      wrapper.vm.currentTimeoutIntervalId = 123;

      wrapper.vm.clearFetchDataTimeout();

      expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
      expect(wrapper.vm.currentTimeoutIntervalId).toBeNull();
    });

    it('does nothing when no timeout is set', () => {
      const wrapper = mountApp();
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      wrapper.vm.clearFetchDataTimeout();

      expect(clearTimeoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('changeAutoRetry', () => {
    it('clears the timeout when auto retry is disabled', async () => {
      const wrapper = mountApp();
      wrapper.vm.currentTimeoutIntervalId = 456;
      wrapper.vm.shouldAutoRetry = false;

      await wrapper.vm.changeAutoRetry();

      expect(wrapper.vm.currentTimeoutIntervalId).toBeNull();
    });

    it('does not clear the timeout when auto retry is enabled', async () => {
      const wrapper = mountApp();
      wrapper.vm.currentTimeoutIntervalId = 456;
      wrapper.vm.shouldAutoRetry = true;

      await wrapper.vm.changeAutoRetry();

      expect(wrapper.vm.currentTimeoutIntervalId).toBe(456);
    });
  });

  describe('fetchData', () => {
    it('fetches data from the API and updates appointments', async () => {
      const slots = [makeSlot()];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(slots),
      });

      const wrapper = mountApp();
      wrapper.vm.shouldAutoRetry = false;

      await wrapper.vm.fetchData();
      await flushPromises();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=1000&locationId=5446&minimum=1'
      );
      expect(wrapper.vm.appointments).toEqual(slots);
      expect(wrapper.vm.didFirstSearch).toBe(true);
      expect(wrapper.vm.activeSearch).toBe(false);
      expect(wrapper.vm.lastSearched).toBeInstanceOf(Date);
    });

    it('sets appointments to empty array when API returns no slots', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve([]),
      });

      const wrapper = mountApp();
      wrapper.vm.shouldAutoRetry = false;

      await wrapper.vm.fetchData();
      await flushPromises();

      expect(wrapper.vm.appointments).toEqual([]);
    });

    it('schedules auto-retry when shouldAutoRetry is true', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve([]),
      });

      const wrapper = mountApp();
      wrapper.vm.shouldAutoRetry = true;

      await wrapper.vm.fetchData();
      await flushPromises();

      expect(wrapper.vm.currentTimeoutIntervalId).not.toBeNull();
    });

    it('sends notification when appointments are found and notifications are enabled', async () => {
      const { createNotification } = await import('../notificationsBuilder');
      vi.mocked(createNotification).mockClear();
      const slots = [makeSlot()];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve(slots),
      });

      const wrapper = mountApp(true);
      wrapper.vm.shouldAutoRetry = false;

      await wrapper.vm.fetchData();
      await flushPromises();

      expect(createNotification).toHaveBeenCalledWith(slots);
    });

    it('does not send notification when notifications are disabled', async () => {
      const { createNotification } = await import('../notificationsBuilder');
      vi.mocked(createNotification).mockClear();

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        json: () => Promise.resolve([makeSlot()]),
      });

      const wrapper = mountApp(false);
      wrapper.vm.shouldAutoRetry = false;

      await wrapper.vm.fetchData();
      await flushPromises();

      expect(createNotification).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('renders the app heading', () => {
      const wrapper = mountApp();
      expect(wrapper.text()).toContain('Global Entry Appointment Search');
    });

    it('renders a Search button', () => {
      const wrapper = mountApp();
      const button = wrapper.find('button');
      expect(button.text()).toBe('Search');
    });

    it('renders auto retry checkbox', () => {
      const wrapper = mountApp();
      const checkbox = wrapper.find('#shouldAutoRetry');
      expect(checkbox.exists()).toBe(true);
    });

    it('shows "No results found" after first search with no appointments', async () => {
      const wrapper = mountApp();
      wrapper.vm.didFirstSearch = true;
      wrapper.vm.activeSearch = false;
      wrapper.vm.appointments = [];
      await wrapper.vm.$nextTick();

      expect(wrapper.find('#noResults').exists()).toBe(true);
      expect(wrapper.text()).toContain('No results found');
    });

    it('shows available appointments section when appointments exist', async () => {
      const wrapper = mountApp();
      wrapper.vm.didFirstSearch = true;
      wrapper.vm.activeSearch = false;
      wrapper.vm.appointments = [makeSlot()];
      await wrapper.vm.$nextTick();

      expect(wrapper.find('#availableResults').exists()).toBe(true);
      expect(wrapper.text()).toContain('Available appointments');
    });

    it('shows search banner when search is active', async () => {
      const wrapper = mountApp();
      wrapper.vm.activeSearch = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.find('#activeSearchBanner').exists()).toBe(true);
    });

    it('does not show results before first search', () => {
      const wrapper = mountApp();
      expect(wrapper.find('#results').exists()).toBe(false);
    });
  });
});
