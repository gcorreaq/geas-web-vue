<script lang="ts">
import AvailableAppointment from './AvailableAppointment.vue';

export default {
  components: {
    AvailableAppointment,
  },

  props: ['appointments'],
};
</script>

<template>
  <table role="grid">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Time</th>
      </tr>
    </thead>
    <tbody>
      <AvailableAppointment
        v-for="({ startTimestamp }, index) in appointments"
        :key="startTimestamp"
        :timestamp="startTimestamp"
        :show-date="
          index === 0 ||
          startTimestamp.substring(0, 10) !==
            appointments[index - 1].startTimestamp.substring(0, 10)
        "
      />
    </tbody>
  </table>
</template>
