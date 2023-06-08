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
        <th scope="col">#</th>
        <th scope="col">Date and time</th>
      </tr>
    </thead>
    <tbody>
      <AvailableAppointment
        v-for="{ startTimestamp } in appointments"
        :key="startTimestamp"
        :timestamp="startTimestamp"
      />
    </tbody>
  </table>
</template>
