<!--
This example fetches latest Vue.js commits data from GitHub’s API and displays them as a list.
You can switch between the two branches.
-->

<script>
import LocationsSelector from './components/LocationsSelector.vue'

const API_URL = `https://ttp.cbp.dhs.gov/schedulerapi/slot-availability`
const DEFAULT_DELAY = 60000 // 1 minute

export default {
  components: {
    LocationsSelector
  },

  data: () => ({
    appointments: [],
    shouldAutoRetry: true,
    availableAppointments: false,
    lastSearched: null,
    currentTimeoutIntervalId: null,
    notificationsEnabled: false,
    didFirstSearch: false
  }),

  computed: {
    lastSearchDate() {
      return this.lastSearched?.toString() || '--'
    }
  },

  methods: {
    clearFetchDataTimeout() {
      if (this.currentTimeoutIntervalId) {
        console.log('Clearing timeouts')
        clearTimeout(this.currentTimeoutIntervalId)
        this.currentTimeoutIntervalId = null
      }
    },
    async fetchData() {
      const url = `${API_URL}?locationId=${this.$refs.locationSelectorRef.currentLocationId}`
      const response = await (await fetch(url)).json()
      const availableSlots = response['availableSlots']
      this.availableAppointments = Array.isArray(availableSlots) && availableSlots.length > 0
      this.appointments = availableSlots || []
      this.lastSearched = new Date()
      this.didFirstSearch = true
      if (this.shouldAutoRetry) {
        await this.delayFetchData(DEFAULT_DELAY)
      }

      if (this.availableAppointments) {
        await this.sendNotification()
      }
    },
    truncate(v) {
      const newline = v.indexOf('\n')
      return newline > 0 ? v.slice(0, newline) : v
    },
    formatDate(v) {
      return v.replace(/T|Z/g, ' ')
    },
    async sendNotification() {
      if (this.notificationsEnabled && Notification.permission === 'granted') {
        new Notification('Appointment available!')
      }
    },
    async changeAutoRetry() {
      if (this.shouldAutoRetry) {
        await self.delayFetchData(DEFAULT_DELAY)
      } else {
        this.clearFetchDataTimeout()
      }
    },
    async changeNotifications() {
      if (this.notificationsEnabled && Notification.permission !== 'denied') {
        await Notification.requestPermission()
      }
    },
    async delayFetchData(time) {
      this.clearFetchDataTimeout()
      this.currentTimeoutIntervalId = setTimeout(async () => {
        await this.fetchData()
      }, time) // 1 minute
    }
  }
}
</script>

<template>
  <LocationsSelector ref="locationSelectorRef" />
  <button @click="fetchData">Search</button>
  <input @change="changeAutoRetry" type="checkbox" v-model="shouldAutoRetry" id="shouldAutoRetry" />
  <label for="shouldAutoRetry">Auto retry?</label>
  <input
    @change="changeNotifications"
    type="checkbox"
    v-model="notificationsEnabled"
    id="shouldSendNotifications"
  />
  <label for="shouldSendNotifications">Get notified?</label>
  <div id="results" v-if="didFirstSearch">
    <div id="availableResults" v-if="availableAppointments">
      <h1>Available appointments</h1>
      <ul>
        <li v-for="{ startTimestamp } in appointments" :key="startTimestamp">
          <span class="date">{{ formatDate(startTimestamp) }}</span>
        </li>
      </ul>
    </div>
    <div id="noResults" v-else>
      <h1>No results found</h1>
    </div>
    <p>Last searched on {{ lastSearchDate }}</p>
    <p v-if="shouldAutoRetry">Searching again in ~60 seconds...</p>
  </div>
</template>

<style></style>
