import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '../AvailableAppointment.vue';

describe('AvailableAppointment', () => {
  it.each([
    [new Date('2024-01-15T10:30'), '10:30'],
    [new Date('2024-06-20T14:00'), '14:00'],
    [new Date('2024-03-20T09:15'), '09:15'],
  ])('formats the time using Intl.DateTimeFormat', (appointmentDate, expectedTime) => {
    const wrapper = mount(AvailableAppointment, {
      props: { appointmentDate, showDate: false },
    });

    expect(wrapper.find('td').text()).toBe(expectedTime);
  });

  it('formats the date using Intl.DateTimeFormat when showDate is true', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { appointmentDate: new Date('2024-01-15T10:30'), showDate: true },
    });

    expect(wrapper.find('th').text()).toBe('Monday, January 15, 2024');
  });

  it('hides the date when showDate is false', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { appointmentDate: new Date('2024-01-15T10:30'), showDate: false },
    });

    expect(wrapper.find('th').text()).toBe('');
  });

  it('renders inside a table row', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { appointmentDate: new Date('2024-01-15T10:30'), showDate: true },
    });

    expect(wrapper.find('tr').exists()).toBe(true);
    expect(wrapper.find('td').exists()).toBe(true);
    expect(wrapper.find('th').exists()).toBe(true);
  });
});
