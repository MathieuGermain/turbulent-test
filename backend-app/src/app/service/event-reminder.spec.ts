import fs from 'fs/promises';
import { EventReminderService, IEventReminder } from './event-reminder';

describe('Event Reminder Service', () => {
    let service: EventReminderService;
    let mockEvent: IEventReminder;

    beforeEach(() => {
        jest.spyOn(fs, 'mkdir').mockImplementation();
        jest.spyOn(fs, 'writeFile').mockImplementation();
        jest.spyOn(fs, 'readFile').mockImplementation();

        mockEvent = {
            title: 'mocked event',
            message: 'hello world',
            triggerTime: Date.now(),
        };

        service = new EventReminderService('test');
    });

    test('getter Events should return an array', () => {
        expect(service.Events).toBeInstanceOf(Array);
    });

    test('Load() should return an array of IEventReminder', async () => {
        jest.spyOn(fs, 'readFile').mockImplementationOnce(async () => JSON.stringify([mockEvent]));
        const events = await EventReminderService.Load('test');
        expect(events).toStrictEqual([mockEvent]);
    });

    test('Load() should return undefined', async () => {
        jest.spyOn(fs, 'readFile').mockImplementationOnce(async () => {
            throw 'file doesnt exist';
        });
        const events = await EventReminderService.Load('test');
        expect(events).toBeUndefined();
    });

    test('save() should emit onEventReminderSaved', (done) => {
        service.once('onEventReminderSaved', done);
        service.save();
    });

    test('addEvent() should emit onEventReminderSaved with added event as param', (done) => {
        service.once('onEventReminderAdded', (event) => {
            expect(event).toStrictEqual(mockEvent);
            done();
        });
        service.addEvent(mockEvent);
    });

    test('removeEvent() should emit onEventReminderRemoved with removed event as param', (done) => {
        service.once('onEventReminderRemoved', (event) => {
            expect(event).toStrictEqual(mockEvent);
            done();
        });
        service.addEvent(mockEvent);
        service.removeEvent(0);
    });

    test('triggerEvent() should emit onEventReminderTriggered with triggered event as param', (done) => {
        service.once('onEventReminderTriggered', (event) => {
            expect(event).toStrictEqual(mockEvent);
            done();
        });
        service.addEvent(mockEvent);
        service.triggerEvent(0);
    });

    test('start() should start the service and emit onServiceStarted', (done) => {
        service.on('onServiceStarted', () => {
            expect(service.Started).toBe(true);
            done();
        });
        service.start();
    });

    test('stop() should stop the service and emit onServiceStopped', (done) => {
        service.on('onServiceStarted', () => service.stop());
        service.on('onServiceStopped', () => {
            expect(service.Started).toBe(false);
            done();
        });
        service.start();
    });
});
