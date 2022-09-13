import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { Server as SocketServer } from 'socket.io';
import { EventReminderService } from './service/event-reminder';
import { Session } from './session';

/**
 * Thrown while trying to start the server
 * and it's is already running.
 */
export class ServerAlreadyListening extends Error {
    constructor(message?: string) {
        super(message || 'The server is already listening!');
        this.name = 'ServerAlreadyListening';
    }
}

/**
 * Event Reminder Application class
 */
export class EventReminderApplication {
    /**
     * Get http server instance
     */
    public get HttpServer() {
        return this.httpServer;
    }
    private httpServer: HttpServer;

    /**
     * Get socket server instance
     */
    public get SocketServer() {
        return this.socketServer;
    }
    private socketServer: SocketServer;

    /**
     * Get event reminder service instance
     */
    public get EventReminderService() {
        return this.eventReminderService;
    }
    private eventReminderService: EventReminderService;

    /**
     * Construct the application
     * @param id pass a unique ID for the service
     */
    constructor(id: string) {
        this.httpServer = createServer();
        this.socketServer = new SocketServer(this.httpServer);
        this.eventReminderService = new EventReminderService(id);

        // Handle process exit
        process.on('SIGINT', () => console.log('Application is closing...'));

        // Wait for event reminder to trigger and emit to everyone
        this.eventReminderService.on('onEventReminderTriggered', (event, index) =>
            this.socketServer.emit('EventReminderTriggered', event, index),
        );

        // Wait for new event reminder to be added and emit it to everyone
        this.eventReminderService.on('onEventReminderAdded', (event, index) =>
            this.socketServer.emit('EventReminderAdded', event, index),
        );

        // Create socket session on connection
        this.socketServer.on('connection', (socket) => new Session(this.eventReminderService, socket));
    }

    /**
     * Start the server.
     * @param port the port to listen to
     * @param host the address to listen to
     * @return async return the port
     */
    public start(port = 0, host = 'localhost') {
        return new Promise<number>((resolve) => {
            if (this.httpServer.listening) throw new ServerAlreadyListening();

            this.httpServer.listen(port, host, () => {
                port = (this.httpServer.address() as AddressInfo).port;
                console.log(`Application running at http://${host}:${port}`);
                resolve(port);
            });
        });
    }

    /**
     * Stop the server.
     */
    public stop() {
        return new Promise<Error | undefined>((resolve) => {
            this.httpServer.close(resolve);
        });
    }
}
