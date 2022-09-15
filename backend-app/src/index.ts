import { config } from 'dotenv';
import { EventReminderApplication } from './app/application';

// Config .env variables
config();

// Parse .env variables or use default values
const SERVICE_ID = process.env.SERVICE_ID ? process.env.SERVICE_ID : 'default-service';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
const HOST = process.env.HOST ? process.env.HOST : 'localhost';

// Instanciate EventReminderApplication
const app = new EventReminderApplication(SERVICE_ID);

/**
 * Start application then start the service
 * - We start listening on the http and socket server
 * - We then start our service process
 */
app.start(PORT, HOST).then(() => app.EventReminderService.start());
