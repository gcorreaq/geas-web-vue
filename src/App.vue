<!--
This example fetches latest Vue.js commits data from GitHub’s API and displays them as a list.
You can switch between the two branches.
-->

<script lang="ts">
import AvailableAppointmentsList from './components/AvailableAppointmentsList.vue';
import IconHelpTooltip from './components/icons/IconHelpTooltip.vue';
import LocationsSelector from './components/LocationsSelector.vue';
import NotificationCheckbox from './components/NotificationCheckbox.vue';
import PageFooter from './components/PageFooter.vue';
import type { ApiAvailableSlots } from './apiTypes';

const API_URL = `https://ttp.cbp.dhs.gov/schedulerapi/slot-availability`;
const DEFAULT_DELAY = 60000; // 1 minute

interface AppData {
  appointments: Array<ApiAvailableSlots>;
  shouldAutoRetry: boolean;
  lastSearched: Date | null;
  currentTimeoutIntervalId: number | null;
  didFirstSearch: boolean;
  activeSearch: boolean;
}

export default {
  components: {
    AvailableAppointmentsList,
    IconHelpTooltip,
    LocationsSelector,
    NotificationCheckbox,
    PageFooter,
  },

  data: (): AppData => ({
    appointments: [],
    shouldAutoRetry: true,
    lastSearched: null,
    currentTimeoutIntervalId: null,
    didFirstSearch: false,
    activeSearch: false,
  }),

  computed: {
    lastSearchDate() {
      return this.lastSearched?.toLocaleString() || '--';
    },
    hasAvailableAppointments() {
      return this.appointments.length > 0;
    },
    searchButtonClass() {
      return this.activeSearch ? 'secondary' : '';
    },
    searchButtonText() {
      return this.activeSearch ? 'Searching...' : 'Search';
    },
  },

  methods: {
    clearFetchDataTimeout() {
      if (this.currentTimeoutIntervalId) {
        console.log('Clearing timeouts');
        clearTimeout(this.currentTimeoutIntervalId);
        this.currentTimeoutIntervalId = null;
      }
    },
    async fetchData() {
      this.activeSearch = true;
      this.clearFetchDataTimeout();
      const url = `${API_URL}?locationId=${
        (this.$refs.locationSelectorRef as typeof LocationsSelector).currentLocationId
      }`;
      const response = await (await fetch(url)).json();
      this.lastSearched = new Date();
      this.appointments = response['availableSlots'] || [];
      this.activeSearch = false;
      this.didFirstSearch = true;
      if (this.shouldAutoRetry) {
        await this.delayFetchData(DEFAULT_DELAY);
      }

      if (this.hasAvailableAppointments) {
        await this.sendNotification();
      }
    },
    async sendNotification() {
      if (
        (this.$refs.notificationCheckboxRef as typeof NotificationCheckbox).notificationsEnabled &&
        Notification.permission === 'granted'
      ) {
        new Notification('Appointment available!');
      }
    },
    async changeAutoRetry() {
      if (!this.shouldAutoRetry) {
        this.clearFetchDataTimeout();
      }
    },
    async delayFetchData(time: number) {
      this.clearFetchDataTimeout();
      this.currentTimeoutIntervalId = setTimeout(async () => {
        await this.fetchData();
      }, time); // 1 minute
    },
  },
};
</script>

<template>
  <div class="grid">
    <div>
      <h1>Global Entry Appointment Search</h1>
    </div>
  </div>
  <div id="searchBar" class="grid">
    <div>
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
        <input
          @change="changeAutoRetry"
          type="checkbox"
          v-model="shouldAutoRetry"
          id="shouldAutoRetry"
          role="switch"
        />
        <label for="shouldAutoRetry">
          Auto retry?
          <IconHelpTooltip tooltip="Automatically do a new search every 60 seconds" />
        </label>
        <NotificationCheckbox ref="notificationCheckboxRef" />
      </form>
    </div>
  </div>
  <div class="grid" id="activeSearchBanner" v-if="activeSearch">
    <div aria-busy="true"></div>
  </div>
  <div class="grid" id="results" v-if="didFirstSearch && !activeSearch">
    <div id="availableResults" v-if="hasAvailableAppointments">
      <h2>Available appointments</h2>
      <AvailableAppointmentsList :appointments="appointments" />
      <p>
        To schedule an appointment go to
        <a href="https://ttp.cbp.dhs.gov/">https://ttp.cbp.dhs.gov/</a>
      </p>
    </div>
    <div id="noResults" v-else>
      <h2>No results found</h2>
    </div>
  </div>
  <div class="grid">
    <div v-if="didFirstSearch">
      <p>
        <em>Last searched on {{ lastSearchDate }}</em>
      </p>
      <p>
        <small v-if="shouldAutoRetry && currentTimeoutIntervalId">
          Auto-retry is activated. Searching again in ~60 seconds...
        </small>
      </p>
    </div>
  </div>
  <PageFooter />
</template>

<style></style>
