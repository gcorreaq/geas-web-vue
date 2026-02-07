<script lang="ts">
export default {
  computed: {
    date(): string {
      return this.timestamp.substring(0, 10);
    },
    time(): string {
      return this.timestamp.substring(11, 16);
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
