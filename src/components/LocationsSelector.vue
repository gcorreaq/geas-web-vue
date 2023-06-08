<script>
import LocationsData from '../assets/locations.json'

const DEFAULT_LOCATION_ID = 5446 // San Francisco Enrollment Center

export default {
  data() {
    return {
      locations: LocationsData,
      currentLocationId: DEFAULT_LOCATION_ID
    }
  }
}
</script>

<template>
  <label for="location">Location: </label>
  <select v-model="currentLocationId" id="location">
    <option
      v-for="{ id, shortName } in locations"
      :key="id"
      :value="id"
      :selected="id === currentLocationId"
    >
      {{ shortName }} ({{ id }})
    </option>
  </select>
</template>
