import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '../AvailableAppointment.vue';

describe('AvailableAppointment', () => {
  it('renders the formatted date replacing T with space', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.text()).toContain('2024-01-15 10:30');
  });

  it('renders the formatted date replacing Z with space', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30Z' },
    });

    expect(wrapper.text()).toContain('2024-01-15 10:30');
  });

  it('renders inside a table row', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.find('tr').exists()).toBe(true);
    expect(wrapper.find('td').exists()).toBe(true);
    expect(wrapper.find('th').exists()).toBe(true);
  });

  it('handles timestamps with both T and Z characters', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-06-20T14:00Z' },
    });

    expect(wrapper.text()).toContain('2024-06-20 14:00');
  });
});
