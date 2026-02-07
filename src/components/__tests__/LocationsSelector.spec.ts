import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LocationsSelector from '../LocationsSelector.vue';

describe('LocationsSelector', () => {
  it('renders a select element with location options', () => {
    const wrapper = mount(LocationsSelector);
    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);

    const options = wrapper.findAll('option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('defaults to San Francisco (ID 5446)', () => {
    const wrapper = mount(LocationsSelector);
    expect(wrapper.vm.currentLocationId).toBe(5446);
  });

  it('sorts locations alphabetically by name in internal data', () => {
    const wrapper = mount(LocationsSelector);
    const locations = wrapper.vm.locations;
    for (let i = 1; i < locations.length; i++) {
      expect(locations[i].name >= locations[i - 1].name).toBe(true);
    }
  });

  it('renders a label with text "Location"', () => {
    const wrapper = mount(LocationsSelector);
    const label = wrapper.find('label');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Location');
  });

  it('includes location ID in option text', () => {
    const wrapper = mount(LocationsSelector);
    const options = wrapper.findAll('option');
    // Every option should have an ID in parentheses
    const hasIdPattern = options.every((o) => /\(\d+\)/.test(o.text()));
    expect(hasIdPattern).toBe(true);
  });

  it('updates currentLocationId when a different option is selected', async () => {
    const wrapper = mount(LocationsSelector);
    const select = wrapper.find('select');
    const firstOption = wrapper.find('option');

    // The first option in the sorted list is never 5446 (San Francisco),
    // so selecting it will change currentLocationId
    await select.setValue(firstOption.element.value);
    expect(wrapper.vm.currentLocationId).not.toBe(5446);
  });
});
