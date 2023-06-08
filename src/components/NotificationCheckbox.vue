<script lang="ts">
import { defineComponent } from 'vue';
import IconHelpTooltip from './icons/IconHelpTooltip.vue';

export default defineComponent({
  components: {
    IconHelpTooltip,
  },

  data() {
    return {
      notificationsEnabled: false,
    };
  },

  methods: {
    async changeNotifications() {
      if (this.notificationsEnabled && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    },
  },
});
</script>

<template>
  <input
    @change="changeNotifications"
    type="checkbox"
    v-model="notificationsEnabled"
    id="shouldSendNotifications"
    role="switch"
  />
  <label for="shouldSendNotifications"
    >Get notified?
    <IconHelpTooltip
      tooltip="Show a notification in your browser when there's new appointments availalbe"
    />
  </label>
</template>
