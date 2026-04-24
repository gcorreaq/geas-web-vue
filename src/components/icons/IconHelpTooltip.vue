<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHelpCircleOutline } from '@mdi/js';

defineProps<{
  tooltip: string;
}>();

const path = mdiHelpCircleOutline;
</script>

<template>
  <a href="#" role="button" :data-tooltip="tooltip" :aria-label="tooltip" @click.prevent>
    <svg-icon type="mdi" :path="path" aria-hidden="true"></svg-icon>
  </a>
</template>
