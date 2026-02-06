import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNotification } from '@/notificationsBuilder';
import type { ApiAvailableSlots } from '@/apiTypes';
import i18next from 'i18next';

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

describe('createNotification', () => {
  const NotificationMock = vi.fn();

  beforeEach(async () => {
    vi.restoreAllMocks();

    await i18next.init({
      lng: 'en',
      resources: {
        en: {
          translation: {
            appointmentNotifications: {
              title_zero: 'No appointments available',
              title_one: 'Appointment available!',
              title_other: 'Appointments available!',
              body_zero: 'No appointments available',
              body_one: '{{count}} appointment is available',
              body_other: '{{count}} appointments are available',
            },
          },
        },
      },
    });

    vi.stubGlobal('Notification', Object.assign(NotificationMock, { permission: 'granted' }));
    NotificationMock.mockClear();
  });

  it('creates a notification when permission is granted and there is one appointment', () => {
    createNotification([makeSlot()]);

    expect(NotificationMock).toHaveBeenCalledOnce();
    expect(NotificationMock).toHaveBeenCalledWith('Appointment available!', {
      body: '1 appointment is available',
      tag: 'geas-new-appointment-available',
    });
  });

  it('creates a notification with plural text for multiple appointments', () => {
    createNotification([makeSlot(), makeSlot({ startTimestamp: '2024-01-16T10:30' })]);

    expect(NotificationMock).toHaveBeenCalledOnce();
    expect(NotificationMock).toHaveBeenCalledWith('Appointments available!', {
      body: '2 appointments are available',
      tag: 'geas-new-appointment-available',
    });
  });

  it('does not create a notification when permission is not granted', () => {
    vi.stubGlobal('Notification', Object.assign(NotificationMock, { permission: 'denied' }));

    createNotification([makeSlot()]);

    expect(NotificationMock).not.toHaveBeenCalled();
  });

  it('does not create a notification when permission is default (not yet asked)', () => {
    vi.stubGlobal('Notification', Object.assign(NotificationMock, { permission: 'default' }));

    createNotification([makeSlot()]);

    expect(NotificationMock).not.toHaveBeenCalled();
  });
});
