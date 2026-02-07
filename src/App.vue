<script setup lang="ts">
import AvailableAppointmentsList from './components/AvailableAppointmentsList.vue';
import IconHelpTooltip from './components/icons/IconHelpTooltip.vue';
import LocationsSelector from './components/LocationsSelector.vue';
import NotificationCheckbox from './components/NotificationCheckbox.vue';
import PageFooter from './components/PageFooter.vue';
import { useAppointmentSearch } from './composables/useAppointmentSearch';

const search = useAppointmentSearch();

const {
  appointments,
  shouldAutoRetry,
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
  fetchData,
  changeAutoRetry,
} = search;

defineExpose(search);
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
