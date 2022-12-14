import fs from 'fs/promises';
import { EventReminderService, IEventReminder } from './event-reminder';

describe('EventReminderService', () => {
    let service: EventReminderService;

    const mockEvent: IEventReminder = {
        title: 'mocked event',
        message: 'hello world',
        triggerTime: Date.now(),
    };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(fs, 'mkdir').mockImplementation();
        jest.spyOn(fs, 'writeFile').mockImplementation();
        jest.spyOn(fs, 'readFile').mockImplementation();

        service = new EventReminderService('test');
    });

    test('`get Events()` should be an array', () => {
        expect(service.Events).toBeInstanceOf(Array);
    });

    test('`get ServiceId()` should be a string', () => {
        expect(typeof service.ServiceId).toBe('string');
    });

    test('`Load()` should return an array', async () => {
        jest.spyOn(fs, 'readFile').mockImplementationOnce(async () => JSON.stringify([mockEvent]));
        const events = await EventReminderService.Load('test');
        expect(events).toStrictEqual([mockEvent]);
    });

    test('`Load()` should return undefined', async () => {
        jest.spyOn(fs, 'readFile').mockImplementationOnce(async () => {
            throw 'file doesnt exist';
        });
        const events = await EventReminderService.Load('test');
        expect(events).toBeUndefined();
    });

    test('`save()` should emit onEventReminderSaved', (done) => {
        service.once('onEventReminderSaved', done);
        service.save();
    });

    test('`addEvent()` should emit onEventReminderAdded', (done) => {
        service.once('onEventReminderAdded', (event) => {
            expect(event).toStrictEqual(mockEvent);
            expect(service.Events.length).toBe(1);
            done();
        });
        service.addEvent(mockEvent);
    });

    test('`removeEvent()` should emit onEventReminderRemoved', (done) => {
        service.once('onEventReminderRemoved', (event) => {
            expect(event).toStrictEqual(mockEvent);
            expect(service.Events.length).toBe(0);
            done();
        });
        service.addEvent(mockEvent);
        service.removeEvent(0);
    });

    test('`triggerEvent()` should emit onEventReminderTriggered', (done) => {
        service.once('onEventReminderTriggered', (event) => {
            expect(event).toStrictEqual(mockEvent);
            expect(service.Events.length).toBe(0);
            done();
        });
        service.addEvent(mockEvent);
        service.triggerEvent(0);
    });

    test('`start()` should start service and emit onServiceStarted', (done) => {
        service.on('onServiceStarted', () => {
            expect(service.Started).toBe(true);
            done();
        });
        service.start();
    });

    test('`stop()` should stop service and emit onServiceStopped', (done) => {
        service.on('onServiceStarted', () => service.stop());
        service.on('onServiceStopped', () => {
            expect(service.Started).toBe(false);
            done();
        });
        service.start();
    });

    test('`process()` should auto-restart after completion', async () => {
        await service.process();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        jest.runOnlyPendingTimers();
        expect(setTimeout).toHaveBeenCalledTimes(2);
    });

    test('`process()` should call `triggerEvent()`', async () => {
        service.addEvent(mockEvent);

        const spy = jest.spyOn(service, 'triggerEvent');
        await service.process();
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockRestore();
    });

    test('`process()` should not call `triggerEvent()`', async () => {
        const spy = jest.spyOn(service, 'triggerEvent');

        await service.process();
        expect(spy).not.toHaveBeenCalled();

        spy.mockRestore();
    });

    test('`process()` should call `save()`', async () => {
        service.addEvent(mockEvent);

        const spy = jest.spyOn(service, 'save');
        await service.process();
        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockRestore();
    });
});
