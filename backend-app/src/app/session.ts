import { Socket } from 'socket.io';
import { EventReminderService, IEventReminder } from './service/event-reminder';

export class Session {
    private service: EventReminderService;
    private socket?: Socket;

    public get connected() {
        return this.socket && this.socket.connected;
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
