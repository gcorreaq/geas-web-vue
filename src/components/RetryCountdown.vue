<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const DEFAULT_INTERVAL = 1000;

const props = defineProps<{
  totalSeconds: number;
}>();

const secondsLeft = ref(props.totalSeconds);
const countdownIntervalId = ref<number | null>(null);

const unitLabel = computed(() => (secondsLeft.value === 1 ? 'second' : 'seconds'));

function startCountdown() {
  countdownIntervalId.value = setInterval(() => {
    secondsLeft.value--;
    if (secondsLeft.value <= 0) {
      stopCountdown();
    }
  }, DEFAULT_INTERVAL);
}

function stopCountdown() {
  if (countdownIntervalId.value) {
    clearInterval(countdownIntervalId.value);
    countdownIntervalId.value = null;
  }
}

onMounted(() => {
  startCountdown();
});

onBeforeUnmount(() => {
  stopCountdown();
});

watch(
  () => props.totalSeconds,
  (newVal) => {
    stopCountdown();
    secondsLeft.value = newVal;
    startCountdown();
  },
);

defineExpose({
  secondsLeft,
  countdownIntervalId,
});
</script>

<template>
  <small> Auto-retry is activated. Searching again in {{ secondsLeft }} {{ unitLabel }}... </small>
</template>

<style></style>
