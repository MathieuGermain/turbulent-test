import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

/**
 * Event Reminder Interface
 */
export interface IEventReminder {
  title: string;
  message: string;
  triggerTime: number;
}

/**
 * Event Reminder Service interface
 */
export interface IEventReminderService {
  get Events(): IEventReminder[]
  onConnectionChanged: BehaviorSubject<boolean>
  onEventsReceived: Subject<IEventReminder[]>
  onEventReminderTriggered: Subject<IEventReminder>
  onEventReminderAdded: Subject<IEventReminder>
  Connect(): void
  Disconnect(): void
  AddEventReminder(event: IEventReminder): boolean
  CreateEventReminder(title: string, message: string, date: Date): IEventReminder
}

/**
 * Event Reminder Service class
 */
@Injectable({
  providedIn: 'root'
})
export class EventReminderService implements IEventReminderService {

  /**
   * Get all Events
   */
  public get Events() {
    return this.events;
  }
  private events: IEventReminder[] = [];

  /**
   * Observe connection state change.
   * Keep the latest value to check the current state.
   */
  public onConnectionChanged = new BehaviorSubject(false);

  /**
   * Observe receiving all events.
   */
  public onEventsReceived = new Subject<IEventReminder[]>();

  /**
   * Observe event reminder triggered.
   */
  public onEventReminderTriggered = new Subject<IEventReminder>();

  /**
   * Observe event reminder added.
   */
  public onEventReminderAdded = new Subject<IEventReminder>();

  constructor(private socket: Socket) {
    socket.on('connect', () => {
      console.log('Connection to the backend successful!');
      this.onConnectionChanged.next(true);

      // Receive all event reminders
      socket.on('Events', (events: IEventReminder[]) => {
        console.log('Received events', events);
        this.events = events;
        this.events = [];
        this.onEventsReceived.next(this.events);
      });

      // Receive event reminder has triggered
      socket.on('EventReminderTriggered', (event: IEventReminder) => {
        console.log('An event triggered', event);
        this.onEventReminderTriggered.next(event);
      });

      // Receive event reminder has been added
      socket.on('EventReminderAdded', (event: IEventReminder) => {
        console.log('An event has been added', event);
        this.events.push(event);
        this.onEventReminderAdded.next(event);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Connection to the backend lost...');
        this.onConnectionChanged.next(false);
      });
    });
  }

  /**
   * Connect to the backend
   */
  public Connect() {
    if (this.socket.ioSocket.connected) return;
    this.socket.connect();
  }

  /**
   * Disconnect from the backend
   */
  public Disconnect() {
    if (!this.socket.ioSocket.connected) return;
    this.socket.disconnect();
  }

  /**
   * Send a new event reminder to add to the backend
   * @param event the event reminder to add
   * @returns true if it was sent
   */
  public AddEventReminder(event: IEventReminder) {
    if (!this.socket.ioSocket.connected) return false;
    this.socket.emit('AddEventReminder', event);
    return true;
  }

  /**
   * Create a new event reminder object
   * @param title the title of the event
   * @param message the message of the event
   * @param date the Date object at which the event will trigger
   * @returns object of type IEventReminder
   */
  public CreateEventReminder(title: string, message: string, date: Date): IEventReminder {
    return {
      title,
      message,
      triggerTime: date.getTime()
    };
  }

}

/**
 * Mock Event Reminder Service Class
 */
export class EventReminderServiceMock implements IEventReminderService {
  get Events(): IEventReminder[] {
    return [];
  }

  onConnectionChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  onEventsReceived: Subject<IEventReminder[]> = new Subject();
  onEventReminderTriggered: Subject<IEventReminder> = new Subject();
  onEventReminderAdded: Subject<IEventReminder> = new Subject();

  Connect(): void { }

  Disconnect(): void { }

  AddEventReminder(event: IEventReminder): boolean { 
    return true;
  }

  CreateEventReminder(title: string, message: string, date: Date): IEventReminder {
    return {
      title: 'test',
      message: 'test message',
      triggerTime: 0
    }
  }
}
