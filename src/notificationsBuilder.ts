import type { ApiAvailableSlots } from '@/apiTypes';

function getNotificationMessages(count: number): { title: string; body: string } {
  if (count === 0) {
    const message = 'No appointments available';
    return { title: message, body: message };
  }

  const plural = count !== 1;
  const appointmentWord = plural ? 'appointments' : 'appointment';
  const verb = plural ? 'are' : 'is';
  const titleWord = plural ? 'Appointments' : 'Appointment';

  return {
    title: `${titleWord} available!`,
    body: `${count} ${appointmentWord} ${verb} available`,
  };
}

export function createNotification(availableAppointments: Array<ApiAvailableSlots>): void {
  if (Notification.permission !== 'granted') {
    return;
  }
  const count = availableAppointments.length;
  const { title, body } = getNotificationMessages(count);
  // TODO: I need an icon for this so it looks nice
  new Notification(title, {
    body,
    tag: 'geas-new-appointment-available',
  });
}
