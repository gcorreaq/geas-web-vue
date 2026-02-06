import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import IconHelpTooltip from '../IconHelpTooltip.vue';

describe('IconHelpTooltip', () => {
  it('renders a link with the tooltip text in data-tooltip attribute', () => {
    const tooltipText = 'This is helpful info';
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: tooltipText },
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('data-tooltip')).toBe(tooltipText);
  });

  it('renders a link with href="#"', () => {
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: 'Some help' },
    });

    expect(wrapper.find('a').attributes('href')).toBe('#');
  });
});
