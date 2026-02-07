import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PageFooter from '../PageFooter.vue';

describe('PageFooter', () => {
  it('renders a link to the GitHub repository', () => {
    const wrapper = shallowMount(PageFooter);

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('https://github.com/gcorreaq/geas-web-vue');
  });

  it('displays the repo name geas-web-vue', () => {
    const wrapper = shallowMount(PageFooter);

    expect(wrapper.text()).toContain('geas-web-vue');
  });
});
