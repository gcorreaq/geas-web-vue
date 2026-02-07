import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import IconHelpTooltip from '../IconHelpTooltip.vue';

describe('IconHelpTooltip', () => {
  it('renders an element with the tooltip text in data-tooltip attribute', () => {
    const tooltipText = 'This is helpful info';
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: tooltipText },
    });

    const tooltip = wrapper.find('.tooltip');
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.attributes('data-tooltip')).toBe(tooltipText);
  });

  it('renders an SVG icon', () => {
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: 'Some help' },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
