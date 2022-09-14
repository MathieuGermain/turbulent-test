import { TestBed } from '@angular/core/testing';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { EventReminderService, IEventReminder } from './event-reminder-service.service';

const config: SocketIoConfig = { url: 'http://localhost:4343' };

const now = Date.now();
const date = new Date(now);
const mockEvent: IEventReminder = {
  title: 'test',
  message: 'test message',
  triggerTime: now
};

describe('EventReminderService', () => {
  let service: EventReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SocketIoModule.forRoot(config) ],
      providers: [ EventReminderService ]
    });
    service = TestBed.inject(EventReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('CreateEventReminder() should create a valid event reminder', () => {
    const event = service.CreateEventReminder('test', 'test message', date);
    expect(event).toEqual(mockEvent);
  });
});
