<script lang="ts">
import AvailableAppointment from './AvailableAppointment.vue';
import type { ApiAvailableSlots } from '../apiTypes';

interface DateGroup {
  dateKey: string;
  appointments: Date[];
}

export default {
  components: {
    AvailableAppointment,
  },

  computed: {
    groupedAppointments(): DateGroup[] {
      const groups: DateGroup[] = [];
      let currentGroup: DateGroup | null = null;

      for (const slot of this.appointments as ApiAvailableSlots[]) {
        const appointmentDate = new Date(slot.startTimestamp);
        const dateKey = appointmentDate.toDateString();

        if (!currentGroup || currentGroup.dateKey !== dateKey) {
          currentGroup = { dateKey, appointments: [appointmentDate] };
          groups.push(currentGroup);
        } else {
          currentGroup.appointments.push(appointmentDate);
        }
      }

      return groups;
    },
  },

  props: ['appointments'],
};
</script>

<template>
  <AvailableAppointment
    v-for="group in groupedAppointments"
    :key="group.dateKey"
    :appointments="group.appointments"
  />
</template>
