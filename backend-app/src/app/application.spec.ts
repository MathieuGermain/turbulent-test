import fs from 'fs/promises';
import { EventReminderApplication, ServerAlreadyListening } from './application';
import { EventReminderService } from './service/event-reminder';

describe('Event Reminder Application', () => {
    let app: EventReminderApplication;

    const port = 4444;

    beforeEach(() => {
        jest.spyOn(fs, 'writeFile').mockImplementation();
        jest.spyOn(fs, 'readFile').mockImplementation();

        app = new EventReminderApplication('test');
        app.EventReminderService.PauseProcess = true;
    });

    afterEach(() => {
        app.SocketServer.close();
        app.HttpServer.close();
    });

    test('getter HttpServer should be set', () => {
        expect(app.HttpServer).toBeTruthy();
    });

    test('getter SocketServer should be set', () => {
        expect(app.SocketServer).toBeTruthy();
    });

    test('getter EventReminderService should be set', () => {
        expect(app.EventReminderService).toBeInstanceOf(EventReminderService);
    });

    test('calling start() twice should throw ServerAlreadyListening error', (done) => {
        app.start(port, 'localhost').then(() =>
            app.start(port, 'localhost').catch((error) => {
                expect(error).toBeInstanceOf(ServerAlreadyListening);
                done();
            }),
        );
    });

    test('start() should start the server', (done) => {
        app.start(port, 'localhost').then(() => {
            expect(app.HttpServer.listening).toBeTruthy();
            done();
        });
    });

    test('stop() should stop the server', (done) => {
        app.start(port, 'localhost').then(() => {
            app.stop();
            expect(app.HttpServer.listening).toBeFalsy();
            done();
        });
    });
});
