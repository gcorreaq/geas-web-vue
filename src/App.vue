<!--
This example fetches latest Vue.js commits data from GitHub's API and displays them as a list.
You can switch between the two branches.
-->

<script setup lang="ts">
import { ref, computed } from 'vue';
import AvailableAppointmentsList from './components/AvailableAppointmentsList.vue';
import IconHelpTooltip from './components/icons/IconHelpTooltip.vue';
import LocationsSelector from './components/LocationsSelector.vue';
import NotificationCheckbox from './components/NotificationCheckbox.vue';
import PageFooter from './components/PageFooter.vue';
import RetryCountdown from './components/RetryCountdown.vue';
import type { ApiAvailableSlots } from './apiTypes';
import { createNotification } from './notificationsBuilder';
import { abortableFetch } from './abortableFetch';

const API_URL = `https://ttp.cbp.dhs.gov/schedulerapi/slots`;
const DEFAULT_DELAY = 60000; // 1 minute
const DEFAULT_DELAY_SECONDS = DEFAULT_DELAY / 1000;

const appointments = ref<ApiAvailableSlots[]>([]);
const shouldAutoRetry = ref(true);
const lastSearched = ref<Date | null>(null);
const currentTimeoutIntervalId = ref<number | null>(null);
const didFirstSearch = ref(false);
const activeSearch = ref(false);

const locationSelectorRef = ref<InstanceType<typeof LocationsSelector> | null>(null);
const notificationCheckboxRef = ref<InstanceType<typeof NotificationCheckbox> | null>(null);

const lastSearchDate = computed(() => lastSearched.value?.toLocaleString() || '--');
const hasAvailableAppointments = computed(() => appointments.value.length > 0);
const searchButtonClass = computed(() => (activeSearch.value ? 'secondary' : ''));
const searchButtonText = computed(() => (activeSearch.value ? 'Searching...' : 'Search'));
const defaultDelaySeconds = DEFAULT_DELAY_SECONDS;

function clearFetchDataTimeout() {
  if (currentTimeoutIntervalId.value) {
    console.log('Clearing timeouts');
    clearTimeout(currentTimeoutIntervalId.value);
    currentTimeoutIntervalId.value = null;
  }
}

async function fetchData() {
  activeSearch.value = true;
  clearFetchDataTimeout();
  const locationId = locationSelectorRef.value?.currentLocationId;
  const url = `${API_URL}?orderBy=soonest&limit=1000&locationId=${locationId}&minimum=1`;

  const result = await abortableFetch<ApiAvailableSlots[]>(url);

  if (!result.ok) {
    if (result.aborted) return;
  } else {
    lastSearched.value = new Date();
    appointments.value = result.data;
    didFirstSearch.value = true;
  }

  activeSearch.value = false;

  if (shouldAutoRetry.value) {
    await delayFetchData(DEFAULT_DELAY);
  }

  if (hasAvailableAppointments.value) {
    await sendNotification();
  }
}

async function sendNotification() {
  if (notificationCheckboxRef.value?.notificationsEnabled) {
    createNotification(appointments.value);
  }
}

async function changeAutoRetry() {
  if (!shouldAutoRetry.value) {
    clearFetchDataTimeout();
  }
}

async function delayFetchData(time: number) {
  clearFetchDataTimeout();
  currentTimeoutIntervalId.value = setTimeout(async () => {
    await fetchData();
  }, time);
}

defineExpose({
  appointments,
  shouldAutoRetry,
  lastSearched,
  currentTimeoutIntervalId,
  didFirstSearch,
  activeSearch,
  lastSearchDate,
  hasAvailableAppointments,
  searchButtonClass,
  searchButtonText,
  defaultDelaySeconds,
  clearFetchDataTimeout,
  fetchData,
  sendNotification,
  changeAutoRetry,
  delayFetchData,
});
</script>

<template>
  <main>
    <div class="grid">
      <div>
        <h4>Global Entry Appointment Search</h4>
        <form @submit.prevent>
          <LocationsSelector ref="locationSelectorRef" />
          <button
            @click="fetchData"
            :aria-busy="activeSearch"
            :class="searchButtonClass"
            :disabled="activeSearch"
          >
            {{ searchButtonText }}
          </button>
          <label for="shouldAutoRetry">
            <input
              @change="changeAutoRetry"
              type="checkbox"
              v-model="shouldAutoRetry"
              id="shouldAutoRetry"
              role="switch"
            />
            Auto retry
            <IconHelpTooltip tooltip="Automatically do a new search every ~60 seconds" />
          </label>
          <NotificationCheckbox ref="notificationCheckboxRef" />
        </form>
      </div>
    </div>
    <div class="grid" id="activeSearchBanner" v-if="activeSearch">
      <div role="status" aria-busy="true">Searching for appointments…</div>
    </div>
    <div class="grid" id="results" aria-live="polite" v-if="didFirstSearch && !activeSearch">
      <div id="availableResults" v-if="hasAvailableAppointments">
        <div>
          <h5>Available appointments</h5>
          <p>
            To schedule an appointment go to
            <a
              href="https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=UP"
              >the Department of Homeland Security's website</a
            >
          </p>
        </div>
        <AvailableAppointmentsList :appointments="appointments" />
      </div>
      <div id="noResults" v-else>
        <h2>No results found</h2>
      </div>
    </div>
    <div class="grid" aria-live="polite">
      <div v-if="didFirstSearch">
        <small
          ><em>Last searched on {{ lastSearchDate }}</em></small
        >
      </div>
      <div v-if="didFirstSearch">
        <RetryCountdown
          v-if="shouldAutoRetry && currentTimeoutIntervalId"
          :total-seconds="defaultDelaySeconds"
        />
      </div>
    </div>
    <PageFooter />
  </main>
</template>

<style></style>
