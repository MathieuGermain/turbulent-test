import { EventReminderApplication } from './app/application';
const app = new EventReminderApplication('main-service');

// Start application then start the service
app.start(3333, 'localhost').then(() => app.EventReminderService.start());
