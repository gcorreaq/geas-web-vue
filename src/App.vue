<script setup lang="ts">
import { ref, computed } from 'vue';
import AvailableAppointmentsList from './components/AvailableAppointmentsList.vue';
import IconHelpTooltip from './components/icons/IconHelpTooltip.vue';
import LocationsSelector from './components/LocationsSelector.vue';
import NotificationCheckbox from './components/NotificationCheckbox.vue';
import PageFooter from './components/PageFooter.vue';
import type { ApiAvailableSlots } from './apiTypes';
import { createNotification } from './notificationsBuilder';

const API_URL = 'https://ttp.cbp.dhs.gov/schedulerapi/slots';
const DEFAULT_DELAY = 60000; // 1 minute
const DEFAULT_LOCATION_ID = 5446; // San Francisco Enrollment Center

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

defineExpose({
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
});
</script>

<template>
  <div>
    <h4>Global Entry Appointment Search</h4>
    <form class="search-form" @submit.prevent>
      <LocationsSelector v-model="locationId" />
      <button @click="fetchData" :class="searchButtonClass" :disabled="activeSearch">
        {{ searchButtonText }}
      </button>
      <div class="form-options">
        <label class="toggle">
          <input @change="changeAutoRetry" type="checkbox" v-model="shouldAutoRetry" />
          Auto retry
          <IconHelpTooltip tooltip="Automatically do a new search every ~60 seconds" />
        </label>
        <NotificationCheckbox v-model="notificationsEnabled" />
      </div>
    </form>
  </div>
  <div id="activeSearchBanner" v-if="activeSearch" class="loading"></div>
  <div v-if="fetchError" class="error-message">Failed to fetch appointments: {{ fetchError }}</div>
  <div id="results" v-if="didFirstSearch && !activeSearch">
    <div id="availableResults" v-if="hasAvailableAppointments">
      <div class="results-header">
        <h5>Available appointments</h5>
        <small>
          To schedule an appointment go to
          <a href="https://ttp.cbp.dhs.gov/">ttp.cbp.dhs.gov</a>
        </small>
      </div>
      <AvailableAppointmentsList :appointments="appointments" />
    </div>
    <div id="noResults" v-else class="no-results">
      <h2>No results found</h2>
    </div>
  </div>
  <div v-if="didFirstSearch" class="status-bar">
    <small
      ><em>Last searched on {{ lastSearchDate }}</em></small
    >
    <small v-if="shouldAutoRetry && currentTimeoutIntervalId">
      Auto-retry is activated. Searching again in ~60 seconds...
    </small>
  </div>
  <PageFooter />
</template>
