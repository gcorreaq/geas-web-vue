<script setup lang="ts">
import { mdiGithub } from '@mdi/js';
</script>

<template>
  <div class="footer">
    <small>
      <a href="https://github.com/gcorreaq/geas-web-vue">
        geas-web-vue
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path :d="mdiGithub" fill="currentColor" />
        </svg>
      </a>
    </small>
  </div>
</template>
