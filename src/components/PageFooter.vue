<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub } from '@mdi/js';

const githubIconSvgPath = mdiGithub;
</script>

<template>
  <div class="grid">
    <div>
      <small>
        <a href="https://github.com/gcorreaq/geas-web-vue"
          >geas-web-vue
          <svg-icon type="mdi" :path="githubIconSvgPath" aria-hidden="true"></svg-icon>
        </a>
      </small>
    </div>
  </div>
</template>
