<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHelpCircleOutline } from '@mdi/js';

defineProps<{
  tooltip: string;
}>();

const path = mdiHelpCircleOutline;
</script>

<template>
  <a href="#" :data-tooltip="tooltip">
    <svg-icon type="mdi" :path="path"></svg-icon>
  </a>
</template>
