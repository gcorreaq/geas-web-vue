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
    const wrapper = shallowMount(NotificationCheckbox);
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);
  });

  it('has notificationsEnabled set to false initially', () => {
    const wrapper = shallowMount(NotificationCheckbox);
    expect(wrapper.vm.notificationsEnabled).toBe(false);
  });

  it('displays "Get notified" label text', () => {
    const wrapper = shallowMount(NotificationCheckbox);
    expect(wrapper.text()).toContain('Get notified');
  });

  it('requests notification permission when checkbox is enabled', async () => {
    const wrapper = shallowMount(NotificationCheckbox);
    const checkbox = wrapper.find('input[type="checkbox"]');

    // setValue already triggers the change event
    await checkbox.setValue(true);

    expect(requestPermissionMock).toHaveBeenCalledOnce();
  });

  it('does not request permission when notification permission is denied', async () => {
    Object.defineProperty(global, 'Notification', {
      value: { permission: 'denied', requestPermission: requestPermissionMock },
      writable: true,
      configurable: true,
    });

    const wrapper = shallowMount(NotificationCheckbox);
    const checkbox = wrapper.find('input[type="checkbox"]');

    await checkbox.setValue(true);

    expect(requestPermissionMock).not.toHaveBeenCalled();
  });

  it('does not request permission when unchecking the checkbox', async () => {
    const wrapper = shallowMount(NotificationCheckbox);

    // First enable
    wrapper.vm.notificationsEnabled = true;
    await wrapper.vm.$nextTick();

    // Then disable
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(false);

    expect(requestPermissionMock).not.toHaveBeenCalled();
  });
});
