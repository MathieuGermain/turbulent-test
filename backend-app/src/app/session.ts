import { Socket } from 'socket.io';
import { EventReminderService, IEventReminder } from './service/event-reminder';

export class Session {
    private socket?: Socket;

    /**
     * Get the instance of the service
     */
    public get Service() {
        return this.service;
    }
    private service: EventReminderService;

    public get connected() {
        return this.socket != undefined && this.socket.connected;
    }

    constructor(service: EventReminderService, socket: Socket) {
        console.log('A client has connected!');
        this.service = service;
        this.socket = socket;

        // Wait for disconnection
        this.socket.on('disconnect', () => {
            console.log('A client has disconnected!');
            this.socket = undefined;
        });

        // Send all active event reminder on session start
        this.socket.emit('Events', this.service.Events);

        // Receive client AddEventReminder command
        this.socket.on('AddEventReminder', (event: IEventReminder) => this.service.addEvent(event));
    }

    /**
     * Disconnect this session
     */
    public disconnect() {
        if (this.connected) {
            this.socket?.disconnect();
            this.socket = undefined;
        }
    }
}
