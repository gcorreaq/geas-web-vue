import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LocationsSelector from '@/components/LocationsSelector.vue';

describe('LocationsSelector', () => {
  it('renders a select element', () => {
    const wrapper = mount(LocationsSelector);
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('defaults to San Francisco (ID 5446)', () => {
    const wrapper = mount(LocationsSelector);
    const select = wrapper.find('select');

    expect((select.element as HTMLSelectElement).value).toBe('5446');
  });

  it('renders multiple location options', () => {
    const wrapper = mount(LocationsSelector);
    const options = wrapper.findAll('option');

    expect(options.length).toBeGreaterThan(0);
  });

  it('sorts locations by name', () => {
    const wrapper = mount(LocationsSelector);
    const vm = wrapper.vm as unknown as { locations: Array<{ name: string }> };
    const names = vm.locations.map((loc) => loc.name);

    const sorted = [...names].sort((a, b) => (a > b ? 1 : -1));
    expect(names).toEqual(sorted);
  });

  it('updates currentLocationId when a different option is selected', async () => {
    const wrapper = mount(LocationsSelector);
    const select = wrapper.find('select');
    const options = wrapper.findAll('option');

    expect(options.length).toBeGreaterThan(1);

    const newValue = options[1].attributes('value')!;
    await select.setValue(newValue);
    expect((wrapper.vm as unknown as { currentLocationId: number }).currentLocationId).toBe(
      Number(newValue)
    );
  });

  it('renders a label for the select', () => {
    const wrapper = mount(LocationsSelector);
    const label = wrapper.find('label');

    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Location');
  });
});
