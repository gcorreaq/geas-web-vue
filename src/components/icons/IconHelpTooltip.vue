<script setup lang="ts">
import { mdiHelpCircleOutline } from '@mdi/js';

defineProps<{ tooltip: string }>();
</script>

<template>
  <span class="tooltip" :data-tooltip="tooltip">
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path :d="mdiHelpCircleOutline" fill="currentColor" />
    </svg>
  </span>
</template>
