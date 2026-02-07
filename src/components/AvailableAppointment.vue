<script lang="ts">
export default {
  data() {
    return {
      parsedDate: new Date(this.timestamp),
    };
  },

  computed: {
    date(): string {
      const d = this.parsedDate as Date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    time(): string {
      const d = this.parsedDate as Date;
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
  },

  props: ['timestamp', 'showDate'],
};
</script>

<template>
  <tr>
    <th scope="row">{{ showDate ? date : '' }}</th>
    <td>{{ time }}</td>
  </tr>
</template>
