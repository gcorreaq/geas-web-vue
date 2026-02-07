import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '../AvailableAppointment.vue';

describe('AvailableAppointment', () => {
  it.each([
    ['2024-01-15T10:30', '2024-01-15 10:30'],
    ['2024-01-15T10:30Z', '2024-01-15 10:30'],
    ['2024-06-20T14:00Z', '2024-06-20 14:00'],
  ])('formats timestamp "%s" as "%s"', (timestamp, expected) => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp },
    });

    expect(wrapper.text()).toContain(expected);
  });

  it('renders the formatted date replacing T with space', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.text()).not.toContain('T');
  });

  it('renders the formatted date removing the trailing Z', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30Z' },
    });

    expect(wrapper.text()).not.toContain('Z');
  });

  it('renders inside a table row', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.find('tr').exists()).toBe(true);
    expect(wrapper.find('td').exists()).toBe(true);
    expect(wrapper.find('th').exists()).toBe(true);
  });
});
