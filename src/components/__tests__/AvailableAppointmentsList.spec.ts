import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointmentsList from '@/components/AvailableAppointmentsList.vue';
import type { ApiAvailableSlots } from '@/apiTypes';

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

    const headers = wrapper.findAll('th');
    expect(headers[0].text()).toBe('#');
    expect(headers[1].text()).toBe('Date and time');
  });

  it('renders one row per appointment', () => {
    const appointments = [
      makeSlot('2024-01-15T10:30'),
      makeSlot('2024-01-16T11:00'),
      makeSlot('2024-01-17T14:15'),
    ];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(3);
  });

  it('renders no rows when appointments array is empty', () => {
    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments: [] },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(0);
  });

  it('displays the formatted timestamp for each appointment', () => {
    const appointments = [makeSlot('2024-01-15T10:30'), makeSlot('2024-02-20T14:00')];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    const cells = wrapper.findAll('tbody td');
    expect(cells[0].text()).toBe('2024-01-15 10:30');
    expect(cells[1].text()).toBe('2024-02-20 14:00');
  });
});
