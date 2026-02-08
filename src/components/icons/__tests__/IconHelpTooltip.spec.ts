import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import IconHelpTooltip from '../IconHelpTooltip.vue';

describe('IconHelpTooltip', () => {
  it('renders a button with the tooltip text in data-tooltip attribute', () => {
    const tooltipText = 'This is helpful info';
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: tooltipText },
    });

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.attributes('data-tooltip')).toBe(tooltipText);
  });

  it('renders a button with aria-label matching the tooltip', () => {
    const tooltipText = 'Some help';
    const wrapper = shallowMount(IconHelpTooltip, {
      props: { tooltip: tooltipText },
    });

    expect(wrapper.find('button').attributes('aria-label')).toBe(tooltipText);
  });
});
