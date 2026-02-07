<script setup lang="ts">
import { computed } from 'vue';
import AvailableAppointment from './AvailableAppointment.vue';
import type { ApiAvailableSlots } from '../apiTypes';

interface DateGroup {
  dateKey: string;
  appointments: Date[];
}

const props = defineProps<{ appointments: ApiAvailableSlots[] }>();

const groupedAppointments = computed<DateGroup[]>(() => {
  const groups: DateGroup[] = [];
  let currentGroup: DateGroup | null = null;

  for (const slot of props.appointments) {
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
});
</script>

<template>
  <AvailableAppointment
    v-for="group in groupedAppointments"
    :key="group.dateKey"
    :appointments="group.appointments"
  />
</template>
