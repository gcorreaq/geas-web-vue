<script setup lang="ts">
import { ref } from 'vue';
import IconHelpTooltip from './icons/IconHelpTooltip.vue';

const notificationsEnabled = ref(false);

async function changeNotifications() {
  if (notificationsEnabled.value && Notification.permission !== 'denied') {
    await Notification.requestPermission();
  }
}

defineExpose({
  notificationsEnabled,
});
</script>

<template>
  <label for="shouldSendNotifications">
    <input
      @change="changeNotifications"
      type="checkbox"
      v-model="notificationsEnabled"
      id="shouldSendNotifications"
      role="switch"
    />
    Get notified
    <IconHelpTooltip
      tooltip="Show a notification in your browser when there's new appointments available"
    />
  </label>
</template>
