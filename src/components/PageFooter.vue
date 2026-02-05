<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub } from '@mdi/js';

interface PageFooterComponentData {
  githubIconSvgPath: string;
}

export default {
  components: {
    SvgIcon,
  },
  data: (): PageFooterComponentData => ({
    githubIconSvgPath: mdiGithub,
  }),
};
</script>

<template>
  <div class="grid">
    <div>
      <small>
        <a href="https://github.com/gcorreaq/geas-web-vue"
          >geas-web-vue
          <svg-icon type="mdi" :path="githubIconSvgPath"></svg-icon>
        </a>
      </small>
    </div>
  </div>
</template>
