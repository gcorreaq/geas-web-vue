import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import NotificationCheckbox from '@/components/NotificationCheckbox.vue';

describe('NotificationCheckbox', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'Notification',
      Object.assign(vi.fn(), {
        permission: 'default',
        requestPermission: vi.fn().mockResolvedValue('granted'),
      })
    );
  });

  it('renders a checkbox input', () => {
    const wrapper = mount(NotificationCheckbox);
    const input = wrapper.find('input[type="checkbox"]');

    expect(input.exists()).toBe(true);
  });

  it('starts with notifications disabled', () => {
    const wrapper = mount(NotificationCheckbox);
    const input = wrapper.find('input[type="checkbox"]');

    expect((input.element as HTMLInputElement).checked).toBe(false);
  });

  it('renders "Get notified" label text', () => {
    const wrapper = mount(NotificationCheckbox);
    const label = wrapper.find('label');

    expect(label.text()).toContain('Get notified');
  });

  it('requests notification permission when checkbox is enabled', async () => {
    const wrapper = mount(NotificationCheckbox);
    const input = wrapper.find('input[type="checkbox"]');

    await input.setValue(true);

    expect(Notification.requestPermission).toHaveBeenCalledOnce();
  });

  it('does not request permission when checkbox is unchecked', async () => {
    const wrapper = mount(NotificationCheckbox);
    const input = wrapper.find('input[type="checkbox"]');

    // Enable then disable
    await input.setValue(true);
    (Notification.requestPermission as ReturnType<typeof vi.fn>).mockClear();

    await input.setValue(false);

    expect(Notification.requestPermission).not.toHaveBeenCalled();
  });

  it('does not request permission when notifications are already denied', async () => {
    vi.stubGlobal(
      'Notification',
      Object.assign(vi.fn(), {
        permission: 'denied',
        requestPermission: vi.fn().mockResolvedValue('denied'),
      })
    );

    const wrapper = mount(NotificationCheckbox);
    const input = wrapper.find('input[type="checkbox"]');

    await input.setValue(true);

    expect(Notification.requestPermission).not.toHaveBeenCalled();
  });
});
