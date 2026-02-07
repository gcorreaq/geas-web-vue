import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNotification } from '../notificationsBuilder';
import type { ApiAvailableSlots } from '../apiTypes';

vi.mock('i18next', () => ({
  default: {
    t: (key: string, options?: { count: number }) => {
      const count = options?.count ?? 0;
      if (key === 'appointmentNotifications.title') {
        if (count === 1) return 'Appointment available!';
        return 'Appointments available!';
      }
      if (key === 'appointmentNotifications.body') {
        if (count === 1) return '1 appointment is available';
        return `${count} appointments are available`;
      }
      return key;
    },
  },
}));

function makeSlot(overrides: Partial<ApiAvailableSlots> = {}): ApiAvailableSlots {
  return {
    locationId: 5446,
    startTimestamp: '2024-01-15T10:30',
    endTimestamp: '2024-01-15T10:45',
    active: true,
    duration: 15,
    remoteInd: false,
    ...overrides,
  };
}

describe('notificationsBuilder', () => {
  let NotificationSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    NotificationSpy = vi.fn();
    Object.defineProperty(global, 'Notification', {
      value: NotificationSpy,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(Notification, 'permission', {
      value: 'granted',
      writable: true,
      configurable: true,
    });
  });

  it('creates a notification when permission is granted', () => {
    const slots = [makeSlot()];
    createNotification(slots);

    expect(NotificationSpy).toHaveBeenCalledOnce();
    expect(NotificationSpy).toHaveBeenCalledWith('Appointment available!', {
      body: '1 appointment is available',
      tag: 'geas-new-appointment-available',
    });
  });

  it.each(['denied', 'default'] as const)(
    'does not create a notification when permission is "%s"',
    (permission) => {
      Object.defineProperty(Notification, 'permission', {
        value: permission,
        configurable: true,
      });

      createNotification([makeSlot()]);
      expect(NotificationSpy).not.toHaveBeenCalled();
    }
  );

  it('passes correct count for multiple appointments', () => {
    const slots = [makeSlot(), makeSlot({ startTimestamp: '2024-01-16T11:00' })];
    createNotification(slots);

    expect(NotificationSpy).toHaveBeenCalledWith('Appointments available!', {
      body: '2 appointments are available',
      tag: 'geas-new-appointment-available',
    });
  });

  it('uses deduplication tag geas-new-appointment-available', () => {
    createNotification([makeSlot()]);

    const callArgs = NotificationSpy.mock.calls[0];
    expect(callArgs[1].tag).toBe('geas-new-appointment-available');
  });
});
