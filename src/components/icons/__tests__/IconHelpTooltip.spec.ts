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

  it('renders a link with aria-label matching the tooltip', () => {
    const tooltipText = 'Some help';
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: tooltipText },
    });

    expect(wrapper.find('a').attributes('aria-label')).toBe(tooltipText);
  });
});
