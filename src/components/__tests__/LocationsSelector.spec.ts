import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LocationsSelector from '../LocationsSelector.vue';

const DEFAULT_LOCATION_ID = 5446;

describe('LocationsSelector', () => {
  it('renders a select element with location options', () => {
    const wrapper = mount(LocationsSelector, {
      props: { modelValue: DEFAULT_LOCATION_ID },
    });
    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);

    const options = wrapper.findAll('option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('selects the option matching modelValue', () => {
    const wrapper = mount(LocationsSelector, {
      props: { modelValue: DEFAULT_LOCATION_ID },
    });
    const select = wrapper.find('select').element as HTMLSelectElement;
    expect(Number(select.value)).toBe(DEFAULT_LOCATION_ID);
  });

  it('sorts locations alphabetically by name', () => {
    const wrapper = mount(LocationsSelector, {
      props: { modelValue: DEFAULT_LOCATION_ID },
    });
    const locations = wrapper.vm.sortedLocations;
    for (let i = 1; i < locations.length; i++) {
      expect(locations[i].name.localeCompare(locations[i - 1].name)).toBeGreaterThanOrEqual(0);
    }
  });

  it('renders a label with text "Location"', () => {
    const wrapper = mount(LocationsSelector, {
      props: { modelValue: DEFAULT_LOCATION_ID },
    });
    const label = wrapper.find('label');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Location');
  });

  it('includes location ID in option text', () => {
    const wrapper = mount(LocationsSelector, {
      props: { modelValue: DEFAULT_LOCATION_ID },
    });
    const options = wrapper.findAll('option');
    const hasIdPattern = options.every((o) => /\(\d+\)/.test(o.text()));
    expect(hasIdPattern).toBe(true);
  });

  it('emits update:modelValue when a different option is selected', async () => {
    const wrapper = mount(LocationsSelector, {
      props: { modelValue: DEFAULT_LOCATION_ID },
    });
    const select = wrapper.find('select');
    const firstOption = wrapper.find('option');

    await select.setValue(firstOption.element.value);

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).not.toBe(DEFAULT_LOCATION_ID);
  });
});
