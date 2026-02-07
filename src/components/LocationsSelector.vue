<script setup lang="ts">
import locationsData from '../assets/locations.json';

const sortedLocations = [...locationsData].sort((a, b) => a.name.localeCompare(b.name));

defineProps<{ modelValue: number }>();
const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

function onSelect(event: Event) {
  emit('update:modelValue', Number((event.target as HTMLSelectElement).value));
}

defineExpose({ sortedLocations });
</script>

<template>
  <label for="location">Location</label>
  <select :value="modelValue" @change="onSelect" id="location">
    <option v-for="{ id, name, shortName } in sortedLocations" :key="id" :value="id">
      {{ shortName ? shortName : name }} ({{ id }})
    </option>
  </select>
</template>
