import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointmentsList from '../AvailableAppointmentsList.vue';
import type { ApiAvailableSlots } from '../../apiTypes';

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

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
  it('renders no details elements when appointments is empty', () => {
    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments: [] },
    });

    expect(wrapper.findAll('details')).toHaveLength(0);
  });

  it('renders one details element per date group', () => {
    const appointments = [
      makeSlot('2024-01-15T10:30'),
      makeSlot('2024-01-15T11:00'),
      makeSlot('2024-01-16T09:00'),
    ];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    // Two date groups: Jan 15 (2 times) and Jan 16 (1 time)
    // Each group renders one top-level details, no nested details (<=3 times)
    expect(wrapper.findAll('details')).toHaveLength(2);
  });

  it('groups appointments from the same date together', () => {
    const appointments = [
      makeSlot('2024-01-15T10:00'),
      makeSlot('2024-01-15T11:00'),
      makeSlot('2024-01-15T12:00'),
      makeSlot('2024-01-16T09:00'),
    ];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    const expectedJan15 = dateFormat.format(new Date('2024-01-15T10:00'));
    const expectedJan16 = dateFormat.format(new Date('2024-01-16T09:00'));
    expect(wrapper.text()).toContain(expectedJan15);
    expect(wrapper.text()).toContain(expectedJan16);

    // Jan 15 has 3 times, Jan 16 has 1 time — no nested details
    expect(wrapper.findAll('details')).toHaveLength(2);
  });

  it('passes parsed dates to child components', () => {
    const appointments = [makeSlot('2024-03-20T09:15')];

    const wrapper = mount(AvailableAppointmentsList, {
      props: { appointments },
    });

    const expectedDate = dateFormat.format(new Date('2024-03-20T09:15'));
    expect(wrapper.text()).toContain(expectedDate);
  });
});
