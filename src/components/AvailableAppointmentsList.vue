<script lang="ts">
import AvailableAppointment from './AvailableAppointment.vue';
import type { ApiAvailableSlots } from '../apiTypes';

interface ParsedAppointment {
  appointmentDate: Date;
  showDate: boolean;
}

export default {
  components: {
    AvailableAppointment,
  },

  computed: {
    parsedAppointments(): ParsedAppointment[] {
      return this.appointments.map((slot: ApiAvailableSlots, index: number) => {
        const appointmentDate = new Date(slot.startTimestamp);
        const showDate =
          index === 0 ||
          appointmentDate.toDateString() !==
            new Date(this.appointments[index - 1].startTimestamp).toDateString();
        return { appointmentDate, showDate };
      });
    },
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
        v-for="{ appointmentDate, showDate } in parsedAppointments"
        :key="appointmentDate.getTime()"
        :appointment-date="appointmentDate"
        :show-date="showDate"
      />
    </tbody>
  </table>
</template>
