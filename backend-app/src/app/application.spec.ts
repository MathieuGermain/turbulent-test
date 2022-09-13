import fs from 'fs/promises';
import { EventReminderApplication, ServerAlreadyListening } from './application';
import { EventReminderService } from './service/event-reminder';

describe('Event Reminder Application', () => {
    let app: EventReminderApplication;

    beforeEach(() => {
        jest.spyOn(fs, 'mkdir').mockImplementation();
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
        app.start().then((port) => {
            app.EventReminderService.PauseProcess = true;
            let error: Error;
            app.start(port)
                .catch((err) => (error = err))
                .finally(() => {
                    expect(error).toBeInstanceOf(ServerAlreadyListening);
                    done();
                });
        });
    });

    test('start() should start the server', (done) => {
        app.start().then(() => {
            expect(app.HttpServer.listening).toBeTruthy();
            done();
        });
    });

    test('stop() should stop the server', (done) => {
        app.start().then(() => {
            app.stop().then(() => {
                expect(app.HttpServer.listening).toBeFalsy();
                done();
            });
        });
    });
});
