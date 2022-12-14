import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { Server as SocketServer } from 'socket.io';
import { EventReminderService, IEventReminder } from './event-reminder';
import { Session } from './session';

/**
 * ServerAlreadyListeningError class.
 * Is thrown when trying to start the server and it's is already running.
 */
export class ServerAlreadyListeningError extends Error {
    constructor(message?: string) {
        super(message || 'The server is already listening!');
        this.name = 'ServerAlreadyListeningError';
    }
}

/**
 * Event Reminder Application class.
 * Main class of the application, handles the server and service.
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
        // Create a new http server
        this.httpServer = createServer();

        // Create a socket server with http server attached
        this.socketServer = new SocketServer(this.httpServer, {
            cors: {
                origin: '*',
                methods: ['GET'],
            },
        });

        // Create the event reminder service
        this.eventReminderService = new EventReminderService(id);

        // Wait for event reminder to trigger and emit to everyone
        this.eventReminderService.on('onEventReminderTriggered', (event: IEventReminder, index: number) =>
            this.socketServer.emit('EventReminderTriggered', event, index),
        );

        // Wait for new event reminder to be added and emit it to everyone
        this.eventReminderService.on('onEventReminderAdded', (event: IEventReminder, index: number) =>
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
            if (this.httpServer.listening) throw new ServerAlreadyListeningError();

            this.httpServer.listen(port, host, () => {
                port = (this.httpServer.address() as AddressInfo).port;
                console.log(`Application started on http://${host}:${port}`);
                resolve(port);
            });
        });
    }

    /**
     * Stop the server.
     * - Disconnect all clients
     * - Close the socket server
     * - Close the http server
     */
    public stop() {
        return new Promise<void>((resolve) => {
            console.log('Application is stopping...');
            this.eventReminderService.stop();
            this.socketServer.disconnectSockets(true);
            this.socketServer.close(() => {
                console.log('socket server closed');
                this.httpServer.close(() => {
                    console.log('http server closed');
                    resolve();
                });
            });
        });
    }
}
