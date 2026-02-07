import type { ApiAvailableSlots } from '@/apiTypes';

export function createNotification(availableAppointments: Array<ApiAvailableSlots>): void {
  if (Notification.permission !== 'granted') {
    return;
  }
  const count = availableAppointments.length;
  const title = count === 1 ? 'Appointment available!' : 'Appointments available!';
  const body = count === 1 ? '1 appointment is available' : `${count} appointments are available`;

  new Notification(title, {
    body,
    tag: 'geas-new-appointment-available',
  });
}
