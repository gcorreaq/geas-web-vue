import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import RetryCountdown from '../RetryCountdown.vue';

describe('RetryCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function mountCountdown(totalSeconds = 60) {
    return mount(RetryCountdown, {
      props: { totalSeconds },
    });
  }

  it('displays the initial countdown value', () => {
    const wrapper = mountCountdown(60);
    expect(wrapper.text()).toContain('Searching again in 60 seconds');
  });

  it('decrements the countdown every second', async () => {
    const wrapper = mountCountdown(60);

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('59 seconds');

    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('58 seconds');
  });

  it('displays singular "second" when countdown is 1', async () => {
    const wrapper = mountCountdown(3);

    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('1 second...');
    expect(wrapper.text()).not.toContain('1 seconds');
  });

  it('stops at 0 and clears the interval', () => {
    const wrapper = mountCountdown(3);

    vi.advanceTimersByTime(3000);
    expect(wrapper.vm.secondsLeft).toBe(0);
    expect(wrapper.vm.countdownIntervalId).toBeNull();
  });

  it('does not go below 0', () => {
    const wrapper = mountCountdown(2);

    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.secondsLeft).toBe(0);
  });

  it('clears the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const wrapper = mountCountdown(60);

    wrapper.unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('restarts countdown when totalSeconds prop changes', async () => {
    const wrapper = mountCountdown(60);

    vi.advanceTimersByTime(10000);
    expect(wrapper.vm.secondsLeft).toBe(50);

    await wrapper.setProps({ totalSeconds: 30 });
    expect(wrapper.vm.secondsLeft).toBe(30);

    vi.advanceTimersByTime(1000);
    expect(wrapper.vm.secondsLeft).toBe(29);
  });
});
