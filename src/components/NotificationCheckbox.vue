<script setup lang="ts">
import IconHelpTooltip from './icons/IconHelpTooltip.vue';

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

async function changeNotifications(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  emit('update:modelValue', checked);
  if (checked && Notification.permission !== 'denied') {
    await Notification.requestPermission();
  }
}
</script>

<template>
  <label class="toggle">
    <input @change="changeNotifications" type="checkbox" :checked="modelValue" />
    Get notified
    <IconHelpTooltip
      tooltip="Show a notification in your browser when there are new appointments available"
    />
  </label>
</template>
