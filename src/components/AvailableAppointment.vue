<script lang="ts">
export default {
  computed: {
    formatDate() {
      return this.timestamp.replace(/T|Z/g, ' ');
    },
  },

  props: ['timestamp'],
};
</script>

<template>
  <tr>
    <th scope="row">1</th>
    <td>{{ formatDate }}</td>
  </tr>
</template>
