import { Server, Socket } from 'socket.io';

export class Session {
    private server?: Server;
    private socket?: Socket;

    public get connected() {
        return this.socket && this.socket.connected;
    }

    constructor(server: Server, socket: Socket) {
        console.log('A client has connected!');
        this.server = server;
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
