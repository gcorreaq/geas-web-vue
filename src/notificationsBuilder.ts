import type { ApiAvailableSlots } from '@/apiTypes';
import i18next from 'i18next';

export function createNotification(availableAppointments: Array<ApiAvailableSlots>): void {
  if (Notification.permission !== 'granted') {
    return;
  }
  const count = availableAppointments.length;
  new Notification(i18next.t('appointmentNotifications.title', { count }), {
    body: i18next.t('appointmentNotifications.body', { count }),
  });
}
