// import './assets/main.css'
import i18next from 'i18next';

import { createApp } from 'vue';
import App from './App.vue';

await i18next.init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  debug: true,
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

createApp(App).mount('#app');
