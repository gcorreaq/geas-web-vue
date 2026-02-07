import { ref, computed, onUnmounted } from 'vue';
import type { ApiAvailableSlots } from '../apiTypes';
import { createNotification } from '../notificationsBuilder';

const API_URL = 'https://ttp.cbp.dhs.gov/schedulerapi/slots';
const DEFAULT_DELAY = 60000; // 1 minute
const DEFAULT_LOCATION_ID = 5446; // San Francisco Enrollment Center

export function useAppointmentSearch() {
  const appointments = ref<ApiAvailableSlots[]>([]);
  const shouldAutoRetry = ref(true);
  const lastSearched = ref<Date | null>(null);
  const currentTimeoutIntervalId = ref<number | null>(null);
  const didFirstSearch = ref(false);
  const activeSearch = ref(false);
  const locationId = ref(DEFAULT_LOCATION_ID);
  const notificationsEnabled = ref(false);
  const fetchError = ref<string | null>(null);

  let abortController: AbortController | null = null;

  const lastSearchDate = computed(() => lastSearched.value?.toLocaleString() ?? '--');
  const hasAvailableAppointments = computed(() => appointments.value.length > 0);
  const searchButtonClass = computed(() => (activeSearch.value ? 'secondary' : ''));
  const searchButtonText = computed(() => (activeSearch.value ? 'Searching...' : 'Search'));

  function clearFetchDataTimeout() {
    if (currentTimeoutIntervalId.value) {
      clearTimeout(currentTimeoutIntervalId.value);
      currentTimeoutIntervalId.value = null;
    }
  }

  function delayFetchData(time: number) {
    clearFetchDataTimeout();
    currentTimeoutIntervalId.value = window.setTimeout(() => {
      fetchData();
    }, time);
  }

  async function fetchData() {
    activeSearch.value = true;
    fetchError.value = null;
    clearFetchDataTimeout();

    abortController?.abort();
    abortController = new AbortController();

    const url = `${API_URL}?orderBy=soonest&limit=1000&locationId=${locationId.value}&minimum=1`;

    try {
      const response = await fetch(url, { signal: abortController.signal });
      if (!response.ok) {
        throw new Error(`Request failed (HTTP ${response.status})`);
      }
      appointments.value = await response.json();
      lastSearched.value = new Date();

      if (hasAvailableAppointments.value && notificationsEnabled.value) {
        createNotification(appointments.value);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      fetchError.value = error instanceof Error ? error.message : 'An unexpected error occurred';
      appointments.value = [];
    } finally {
      activeSearch.value = false;
      didFirstSearch.value = true;
    }

    if (shouldAutoRetry.value) {
      delayFetchData(DEFAULT_DELAY);
    }
  }

  function changeAutoRetry() {
    if (!shouldAutoRetry.value) {
      clearFetchDataTimeout();
    }
  }

  onUnmounted(() => {
    clearFetchDataTimeout();
    abortController?.abort();
  });

  return {
    appointments,
    shouldAutoRetry,
    lastSearched,
    currentTimeoutIntervalId,
    didFirstSearch,
    activeSearch,
    locationId,
    notificationsEnabled,
    fetchError,
    lastSearchDate,
    hasAvailableAppointments,
    searchButtonClass,
    searchButtonText,
    clearFetchDataTimeout,
    fetchData,
    changeAutoRetry,
    delayFetchData,
  };
}
