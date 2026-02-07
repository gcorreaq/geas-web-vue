<script setup lang="ts">
import { computed } from 'vue';

const MAX_VISIBLE_TIMES = 3;

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

const props = defineProps<{ appointments: Date[] }>();

const date = computed(() => dateFormat.format(props.appointments[0]));
const firstTime = computed(() => timeFormat.format(props.appointments[0]));
const visibleTimes = computed(() =>
  props.appointments.slice(0, MAX_VISIBLE_TIMES).map((d) => timeFormat.format(d))
);
const hiddenTimes = computed(() =>
  props.appointments.slice(MAX_VISIBLE_TIMES).map((d) => timeFormat.format(d))
);
const hasMoreTimes = computed(() => props.appointments.length > MAX_VISIBLE_TIMES);
const moreCount = computed(() => props.appointments.length - MAX_VISIBLE_TIMES);
</script>

<template>
  <details>
    <summary>{{ date }} — first available: {{ firstTime }}</summary>
    <ul>
      <li v-for="time in visibleTimes" :key="time">{{ time }}</li>
      <li v-if="hasMoreTimes">
        <details>
          <summary>and {{ moreCount }} more</summary>
          <ul>
            <li v-for="time in hiddenTimes" :key="time">{{ time }}</li>
          </ul>
        </details>
      </li>
    </ul>
  </details>
</template>
