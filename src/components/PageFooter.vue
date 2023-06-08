<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub, mdiSourceBranch } from '@mdi/js';

interface PageFooterComponentData {
  githubIconSvgPath: string;
  sourceBranch: string;
}

export default {
  components: {
    SvgIcon,
  },
  data: (): PageFooterComponentData => ({
    githubIconSvgPath: mdiGithub,
    sourceBranch: mdiSourceBranch,
  }),
};
</script>

<template>
  <div class="grid">
    <div>
      Made by
      <a href="https://github.com/gcorreaq"
        >gcorreaq <svg-icon type="mdi" :path="githubIconSvgPath"></svg-icon
      ></a>
    </div>
    <div>
      <a href="https://github.com/gcorreaq/gean-web"
        >gean-web
        <svg-icon type="mdi" :path="sourceBranch"></svg-icon>
      </a>
    </div>
  </div>
</template>
