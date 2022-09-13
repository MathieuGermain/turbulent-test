import fs from 'fs/promises';
import { AddressInfo } from 'net';
import { createServer, Server as HttpServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import { connect, Socket as ClientSocket } from 'socket.io-client';
import { Session } from './session';
import { EventReminderService } from './service/event-reminder';

describe('Socket Session', () => {
    /** socket server */
    let io: Server;

    /** http server */
    let httpServer: HttpServer;

    /** socket session */
    let session: Session;

    /** server socket instance */
    let serverSocket: ServerSocket;

    /** client socket instance */
    let clientSocket: ClientSocket;

    // Start socket server at start of test suite
    beforeAll((done) => {
        jest.spyOn(fs, 'mkdir').mockImplementation();
        jest.spyOn(fs, 'writeFile').mockImplementation();
        jest.spyOn(fs, 'readFile').mockImplementation();

        httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(done);
    });

    // Stop socket server at end of test suite
    afterAll((done) => {
        httpServer.close(done);
    });

    // Connect new socket before each test.
    // Also instanciate a new Session instance to test against.
    beforeEach((done) => {
        const port: number = (httpServer.address() as AddressInfo).port;
        clientSocket = connect(`http://localhost:${port}`);
        io.on('connection', (socket) => {
            serverSocket = socket;
            session = new Session(new EventReminderService('test'), socket);
        });
        clientSocket.on('connect', done);
    });

    // Disconnect socket after each test
    afterEach(() => {
        serverSocket.disconnect();
        clientSocket.disconnect();
    });

    test(`getter 'connected' should be true`, () => {
        expect(session.connected).toBe(true);
    });

    test('expect session.connected to be falsy when session.disconnect() is called', () => {
        session.disconnect();
        expect(session.connected).toBeFalsy();
    });

    test('expect the client connection to be closed when session.disconnect() is called', (done) => {
        clientSocket.on('disconnect', () => {
            expect(clientSocket.connected).toBeFalsy();
            done();
        });
        session.disconnect();
    });

    test('expect an event reminder to be added when session receive AddEventReminder command', (done) => {
        serverSocket.on('AddEventReminder', () => {
            expect(session.Service.Events.length).toBe(1);
            done();
        });
        clientSocket.emit('AddEventReminder', {
            title: 'mocked event',
            message: 'hello world',
            triggerTime: Date.now(),
        });
    });
});
