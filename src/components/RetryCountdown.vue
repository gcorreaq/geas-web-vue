<script lang="ts">
const DEFAULT_INTERVAL = 1000;

interface RetryCountdownData {
  secondsLeft: number;
  countdownIntervalId: number | null;
}

export default {
  props: {
    totalSeconds: {
      type: Number,
      required: true,
    },
  },

  data(): RetryCountdownData {
    return {
      secondsLeft: this.totalSeconds,
      countdownIntervalId: null,
    };
  },

  computed: {
    unitLabel(): string {
      return this.secondsLeft === 1 ? 'second' : 'seconds';
    },
  },

  mounted() {
    this.startCountdown();
  },

  beforeUnmount() {
    this.stopCountdown();
  },

  watch: {
    totalSeconds(newVal: number) {
      this.stopCountdown();
      this.secondsLeft = newVal;
      this.startCountdown();
    },
  },

  methods: {
    startCountdown() {
      this.countdownIntervalId = setInterval(() => {
        this.secondsLeft--;
        if (this.secondsLeft <= 0) {
          this.stopCountdown();
        }
      }, DEFAULT_INTERVAL);
    },
    stopCountdown() {
      if (this.countdownIntervalId) {
        clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = null;
      }
    },
  },
};
</script>

<template>
  <small> Auto-retry is activated. Searching again in {{ secondsLeft }} {{ unitLabel }}... </small>
</template>

<style></style>
