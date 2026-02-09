<script setup lang="ts">
import { ref } from 'vue';
import LocationsData from '../assets/locations.json';

const DEFAULT_LOCATION_ID = 5446; // San Francisco Enrollment Center

const locations = LocationsData.sort((a, b) => (a.name > b.name ? 1 : -1));
const currentLocationId = ref(DEFAULT_LOCATION_ID);

defineExpose({
  locations,
  currentLocationId,
});
</script>

<template>
  <label for="location">Location</label>
  <select v-model="currentLocationId" id="location" class="is-left">
    <option
      v-for="{ id, name, shortName } in locations"
      :key="id"
      :value="id"
      :selected="id === currentLocationId"
    >
      {{ shortName ? shortName : name }} ({{ id }})
    </option>
  </select>
</template>
