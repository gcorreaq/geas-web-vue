import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '@/components/AvailableAppointment.vue';

describe('AvailableAppointment', () => {
  it('renders formatted date replacing T with space', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.find('td').text()).toBe('2024-01-15 10:30');
  });

  it('renders formatted date replacing both T and Z with spaces', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30Z' },
    });

    expect(wrapper.find('td').text()).toBe('2024-01-15 10:30');
  });

  it('renders inside a table row', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30' },
    });

    expect(wrapper.find('tr').exists()).toBe(true);
    expect(wrapper.find('th').text()).toBe('1');
  });
});
