<script lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGithub, mdiMastodon } from '@mdi/js';

interface PageFooterComponentData {
  githubIconSvgPath: string;
  mastodonIconSvgPath: string;
}

export default {
  components: {
    SvgIcon,
  },
  data: (): PageFooterComponentData => ({
    githubIconSvgPath: mdiGithub,
    mastodonIconSvgPath: mdiMastodon,
  }),
};
</script>

<template>
  <div class="grid">
    <div>
      Made by
      <a href="https://mastodon.social/@gonchimon"
        >@gonchimon@mastodon.social <svg-icon type="mdi" :path="mastodonIconSvgPath"></svg-icon
      ></a>
      |
      <a href="https://github.com/gcorreaq/geas-web-vue"
        >geas-web-vue
        <svg-icon type="mdi" :path="githubIconSvgPath"></svg-icon>
      </a>
    </div>
  </div>
</template>
