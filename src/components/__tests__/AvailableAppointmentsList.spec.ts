import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointmentsList from '../AvailableAppointmentsList.vue';
import type { ApiAvailableSlots } from '../../apiTypes';

function makeSlot(startTimestamp: string): ApiAvailableSlots {
  return {
    locationId: 5446,
    startTimestamp,
    endTimestamp: '2024-01-15T10:45',
    active: true,
    duration: 15,
    remoteInd: false,
  };
}

describe('AvailableAppointmentsList', () => {
  it('renders a table with header columns', () => {
    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments: [] },
    });

    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('thead').exists()).toBe(true);
    const headers = wrapper.findAll('th');
    expect(headers.some((h) => h.text() === '#')).toBe(true);
    expect(headers.some((h) => h.text() === 'Date and time')).toBe(true);
  });

  it('renders no appointment rows when appointments is empty', () => {
    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments: [] },
    });

    expect(wrapper.find('tbody').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr')).toHaveLength(0);
  });

  it('renders one row per appointment', () => {
    const appointments = [makeSlot('2024-01-15T10:30'), makeSlot('2024-01-16T11:00')];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  it('passes startTimestamp to child AvailableAppointment components', () => {
    const appointments = [makeSlot('2024-03-20T09:15')];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    expect(wrapper.text()).toContain('2024-03-20 09:15');
  });
});
