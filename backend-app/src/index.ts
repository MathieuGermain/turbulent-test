import { EventReminderApplication } from './app/application';
const app = new EventReminderApplication('main-service');

// Run the application
app.start(3333, 'localhost');
