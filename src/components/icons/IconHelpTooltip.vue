<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHelpCircleOutline } from '@mdi/js';

export default {
  components: {
    SvgIcon,
  },
  data() {
    return {
      path: mdiHelpCircleOutline,
    };
  },
  props: ['tooltip'],
};
</script>

<template>
  <a href="#" :data-tooltip="tooltip">
    <svg-icon type="mdi" :path="path"></svg-icon>
  </a>
</template>
