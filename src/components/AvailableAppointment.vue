<script lang="ts">
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

const MAX_VISIBLE_TIMES = 3;

export default {
  computed: {
    date(): string {
      return dateFormat.format((this.appointments as Date[])[0]);
    },
    firstTime(): string {
      return timeFormat.format((this.appointments as Date[])[0]);
    },
    visibleTimes(): string[] {
      return (this.appointments as Date[])
        .slice(0, MAX_VISIBLE_TIMES)
        .map((d) => timeFormat.format(d));
    },
    hiddenTimes(): string[] {
      return (this.appointments as Date[])
        .slice(MAX_VISIBLE_TIMES)
        .map((d) => timeFormat.format(d));
    },
    hasMoreTimes(): boolean {
      return (this.appointments as Date[]).length > MAX_VISIBLE_TIMES;
    },
    moreCount(): number {
      return (this.appointments as Date[]).length - MAX_VISIBLE_TIMES;
    },
  },

  props: ['appointments'],
};
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
