import { config } from 'dotenv';
import { EventReminderApplication } from './app/application';

// Initialize Env Variables
config();

const SERVICE_ID = process.env.SERVICE_ID ? process.env.SERVICE_ID : 'default-service';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
const HOST = process.env.HOST ? process.env.HOST : 'localhost';

// Initialize Event Reminder App
const app = new EventReminderApplication(SERVICE_ID);

// Start application then start the service
app.start(PORT, HOST).then(() => app.EventReminderService.start());
