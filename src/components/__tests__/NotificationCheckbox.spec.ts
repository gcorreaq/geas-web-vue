import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import NotificationCheckbox from '../NotificationCheckbox.vue';

describe('NotificationCheckbox', () => {
  let requestPermissionMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    requestPermissionMock = vi.fn().mockResolvedValue('granted');
    Object.defineProperty(global, 'Notification', {
      value: { permission: 'default', requestPermission: requestPermissionMock },
      writable: true,
      configurable: true,
    });
  });

  it('renders a checkbox input', () => {
    const wrapper = shallowMount(NotificationCheckbox, {
      props: { modelValue: false },
    });
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);
  });

  it('checkbox reflects modelValue prop', () => {
    const wrapper = shallowMount(NotificationCheckbox, {
      props: { modelValue: false },
    });
    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('displays "Get notified" label text', () => {
    const wrapper = shallowMount(NotificationCheckbox, {
      props: { modelValue: false },
    });
    expect(wrapper.text()).toContain('Get notified');
  });

  it('requests notification permission when checkbox is enabled', async () => {
    const wrapper = shallowMount(NotificationCheckbox, {
      props: { modelValue: false },
    });
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);

    expect(requestPermissionMock).toHaveBeenCalledOnce();
  });

  it('does not request permission when notification permission is denied', async () => {
    Object.defineProperty(global, 'Notification', {
      value: { permission: 'denied', requestPermission: requestPermissionMock },
      writable: true,
      configurable: true,
    });

    const wrapper = shallowMount(NotificationCheckbox, {
      props: { modelValue: false },
    });
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);

    expect(requestPermissionMock).not.toHaveBeenCalled();
  });

  it('emits update:modelValue when checkbox is toggled', async () => {
    const wrapper = shallowMount(NotificationCheckbox, {
      props: { modelValue: false },
    });
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toBe(true);
  });
});
