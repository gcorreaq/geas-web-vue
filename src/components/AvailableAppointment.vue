<script lang="ts">
const dateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export default {
  computed: {
    date(): string {
      return dateFormat.format(this.appointmentDate as Date);
    },
    time(): string {
      return timeFormat.format(this.appointmentDate as Date);
    },
  },

  props: ['appointmentDate', 'showDate'],
};
</script>

<template>
  <tr>
    <th scope="row">{{ showDate ? date : '' }}</th>
    <td>{{ time }}</td>
  </tr>
</template>
