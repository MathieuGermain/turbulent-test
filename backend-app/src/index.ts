import { config } from 'dotenv';
import { EventReminderApplication } from './app/application';

// Initialize Env Variables
config();

// Initialize Event Reminder App
const app = new EventReminderApplication(process.env.SERVICE_ID ? process.env.SERVICE_ID : 'default-service');

// Start application then start the service
app.start(process.env.PORT ? Number(process.env.PORT) : 3333, process.env.HOST ? process.env.HOST : 'localhost').then(
    () => app.EventReminderService.start(),
);
