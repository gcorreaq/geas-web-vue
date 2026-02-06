import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconHelpTooltip from '@/components/icons/IconHelpTooltip.vue';

describe('IconHelpTooltip', () => {
  it('renders a link with the tooltip text in data-tooltip attribute', () => {
    const wrapper = mount(IconHelpTooltip, {
      props: { tooltip: 'This is help text' },
    });
    const link = wrapper.find('a');

    expect(link.exists()).toBe(true);
    expect(link.attributes('data-tooltip')).toBe('This is help text');
  });

  it('sets href to #', () => {
    const wrapper = mount(IconHelpTooltip, {
      props: { tooltip: 'Help' },
    });
    const link = wrapper.find('a');

    expect(link.attributes('href')).toBe('#');
  });
});
