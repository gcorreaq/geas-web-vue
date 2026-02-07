import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableAppointment from '../AvailableAppointment.vue';

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

describe('AvailableAppointment', () => {
  it('renders a details element with a summary', () => {
    const wrapper = mount(AvailableAppointment, {
      props: { appointments: [new Date('2024-01-15T10:30')] },
    });

    expect(wrapper.find('details').exists()).toBe(true);
    expect(wrapper.find('summary').exists()).toBe(true);
  });

  it('shows formatted date and first available time in the summary', () => {
    const date = new Date('2024-01-15T10:30');
    const wrapper = mount(AvailableAppointment, {
      props: { appointments: [date, new Date('2024-01-15T11:00')] },
    });

    const summary = wrapper.find('summary').text();
    expect(summary).toContain(dateFormat.format(date));
    expect(summary).toContain(timeFormat.format(date));
    expect(summary).toContain('first available');
  });

  it('shows all times when there are 3 or fewer', () => {
    const appointments = [
      new Date('2024-01-15T10:30'),
      new Date('2024-01-15T11:00'),
      new Date('2024-01-15T11:30'),
    ];
    const wrapper = mount(AvailableAppointment, {
      props: { appointments },
    });

    const items = wrapper.findAll('details > ul > li');
    expect(items).toHaveLength(3);
    expect(items[0].text()).toBe(timeFormat.format(appointments[0]));
    expect(items[1].text()).toBe(timeFormat.format(appointments[1]));
    expect(items[2].text()).toBe(timeFormat.format(appointments[2]));
  });

  it('does not show nested details when there are 3 or fewer times', () => {
    const wrapper = mount(AvailableAppointment, {
      props: {
        appointments: [new Date('2024-01-15T10:30'), new Date('2024-01-15T11:00')],
      },
    });

    expect(wrapper.findAll('details details')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('more');
  });

  it('shows "and N more" when there are more than 3 times', () => {
    const appointments = [
      new Date('2024-01-15T10:30'),
      new Date('2024-01-15T11:00'),
      new Date('2024-01-15T11:30'),
      new Date('2024-01-15T12:00'),
      new Date('2024-01-15T12:30'),
    ];
    const wrapper = mount(AvailableAppointment, {
      props: { appointments },
    });

    const topLevelUl = wrapper.find('details > ul');
    expect(topLevelUl.element.children).toHaveLength(4); // 3 times + 1 nested details
    expect(wrapper.text()).toContain('and 2 more');
  });

  it('shows hidden times inside the nested details', () => {
    const appointments = [
      new Date('2024-01-15T10:30'),
      new Date('2024-01-15T11:00'),
      new Date('2024-01-15T11:30'),
      new Date('2024-01-15T12:00'),
      new Date('2024-01-15T12:30'),
    ];
    const wrapper = mount(AvailableAppointment, {
      props: { appointments },
    });

    const nestedDetails = wrapper.find('details details');
    expect(nestedDetails.exists()).toBe(true);

    const nestedItems = nestedDetails.findAll('li');
    expect(nestedItems).toHaveLength(2);
    expect(nestedItems[0].text()).toBe(timeFormat.format(appointments[3]));
    expect(nestedItems[1].text()).toBe(timeFormat.format(appointments[4]));
  });

  it('formats times according to browser locale', () => {
    const date = new Date('2024-01-15T14:00');
    const wrapper = mount(AvailableAppointment, {
      props: { appointments: [date] },
    });

    const expectedTime = timeFormat.format(date);
    expect(wrapper.text()).toContain(expectedTime);
  });
});
