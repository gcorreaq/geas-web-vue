import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PageFooter from '@/components/PageFooter.vue';

describe('PageFooter', () => {
  it('renders a link to the GitHub repository', () => {
    const wrapper = mount(PageFooter);
    const link = wrapper.find('a');

    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('https://github.com/gcorreaq/geas-web-vue');
  });

  it('displays the repository name', () => {
    const wrapper = mount(PageFooter);
    const link = wrapper.find('a');

    expect(link.text()).toContain('geas-web-vue');
  });
});
