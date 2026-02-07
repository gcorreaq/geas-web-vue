import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '../AvailableAppointment.vue';

describe('AvailableAppointment', () => {
  it.each([
    ['2024-01-15T10:30', '10:30'],
    ['2024-01-15T10:30Z', '10:30'],
    ['2024-06-20T14:00Z', '14:00'],
  ])('extracts time from timestamp "%s" as "%s"', (timestamp, expectedTime) => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp, showDate: false },
    });

    expect(wrapper.find('td').text()).toBe(expectedTime);
  });

  it('shows the date when showDate is true', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30', showDate: true },
    });

    expect(wrapper.find('th').text()).toBe('2024-01-15');
  });

  it('hides the date when showDate is false', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30', showDate: false },
    });

    expect(wrapper.find('th').text()).toBe('');
  });

  it('renders inside a table row', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { timestamp: '2024-01-15T10:30', showDate: true },
    });

    expect(wrapper.find('tr').exists()).toBe(true);
    expect(wrapper.find('td').exists()).toBe(true);
    expect(wrapper.find('th').exists()).toBe(true);
  });
});
