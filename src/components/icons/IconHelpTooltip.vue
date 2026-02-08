<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHelpCircleOutline } from '@mdi/js';

defineProps<{
  tooltip: string;
}>();

const path = mdiHelpCircleOutline;
</script>

<template>
  <button type="button" :data-tooltip="tooltip" :aria-label="tooltip" class="outline">
    <svg-icon type="mdi" :path="path" aria-hidden="true"></svg-icon>
  </button>
</template>
