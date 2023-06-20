import type { ApiAvailableSlots } from '@/apiTypes';
import i18next from 'i18next';

export function createNotification(availableAppointments: Array<ApiAvailableSlots>): void {
  if (Notification.permission !== 'granted') {
    return;
  }
  const count = availableAppointments.length;
  // TODO: I need an icon for this so it looks nice
  new Notification(i18next.t('appointmentNotifications.title', { count }), {
    body: i18next.t('appointmentNotifications.body', { count }),
    tag: 'geas-new-appointment-available',
  });
}
