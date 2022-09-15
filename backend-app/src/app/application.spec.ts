import fs from 'fs/promises';
import { connect, Socket as ClientSocket } from 'socket.io-client';
import { EventReminderApplication, ServerAlreadyListeningError } from './application';
import { EventReminderService, IEventReminder } from './service/event-reminder';

describe('EventReminderApplication', () => {
    let app: EventReminderApplication;
    let client: ClientSocket;

    const mockEvent: IEventReminder = {
        title: 'mocked event',
        message: 'hello world',
        triggerTime: Date.now(),
    };

    beforeEach(() => {
        jest.spyOn(fs, 'mkdir').mockImplementation();
        jest.spyOn(fs, 'writeFile').mockImplementation();
        jest.spyOn(fs, 'readFile').mockImplementation();

        app = new EventReminderApplication('test');
    });

    afterEach(() => {
        client?.disconnect();
        app.SocketServer.close();
        app.HttpServer.close();
    });

    test('`get HttpServer()` should be set', () => {
        expect(app.HttpServer).toBeTruthy();
    });

    test('`get SocketServer()` should be set', () => {
        expect(app.SocketServer).toBeTruthy();
    });

    test('`get EventReminderService()` should be set', () => {
        expect(app.EventReminderService).toBeInstanceOf(EventReminderService);
    });

    it('`start()`should start the server', (done) => {
        app.start().then(() => {
            expect(app.HttpServer.listening).toBeTruthy();
            done();
        });
    });

    it('`stop()` should stop the server', (done) => {
        app.start().then(() => {
            app.stop().then(() => {
                expect(app.HttpServer.listening).toBeFalsy();
                done();
            });
        });
    });

    it('should throw ServerAlreadyListeningError when calling `start()` twice', (done) => {
        app.start().then(() =>
            app.start().catch((error) => {
                expect(error).toBeInstanceOf(ServerAlreadyListeningError);
                done();
            }),
        );
    });

    test('client should receive `EventReminderTriggered` when service `onEventReminderTriggered` is emitted', (done) => {
        app.start().then((port) => {
            client = connect(`http://localhost:${port}`);
            client.on('connect', () => {
                console.log(`client has connected on port ${port}`);
                client.on('EventReminderTriggered', () => done());
                app.EventReminderService.addEvent(mockEvent);
                app.EventReminderService.triggerEvent(0);
            });
        });
    });

    test('client should receive `EventReminderAdded` when service `onEventReminderAdded` is emitted', (done) => {
        app.start().then((port) => {
            client = connect(`http://localhost:${port}`);
            client.on('connect', () => {
                console.log(`client has connected on port ${port}`);
                client.on('EventReminderAdded', () => done());
                app.EventReminderService.addEvent(mockEvent);
            });
        });
    });
});
