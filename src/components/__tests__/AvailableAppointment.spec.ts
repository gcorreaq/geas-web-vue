import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '@/components/AvailableAppointment.vue';

describe('AvailableAppointment', () => {
  it.each([
    { timestamp: '2024-01-15T10:30', expected: '2024-01-15 10:30' },
    { timestamp: '2024-01-15T10:30Z', expected: '2024-01-15 10:30' },
  ])('formats "$timestamp" as "$expected"', ({ timestamp, expected }) => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp },
    });

    expect(wrapper.find('td').text()).toBe(expected);
  });

  it('renders inside a table row', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.find('tr').exists()).toBe(true);
    expect(wrapper.find('th').text()).toBe('1');
  });
});
