import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { NotificationService } from './notification.service';

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
  get connected(): boolean
  get events(): IEventReminder[]
  
  onConnectionChanged: BehaviorSubject<boolean>
  onEventRemindersChanged: Subject<IEventReminder[]>
  onEventReminderTriggered: Subject<IEventReminder>
  onEventReminderAdded: Subject<IEventReminder>

  connect(): void
  disconnect(): void
  sendNewEventReminder(event: IEventReminder): boolean
  createEventReminder(title: string, message: string, date: Date): IEventReminder
}

/**
 * Event Reminder Service class
 */
@Injectable({
  providedIn: 'root'
})
export class EventReminderService implements IEventReminderService {

  /**
   * Check if service is connected to the backend
   */
   public get connected() {
    return this.onConnectionChanged.value;
  }

  /**
   * Get the latest events snapshop
   */
  public get events() {
    return this.onEventRemindersChanged.value;
  }

  /**
   * Observe connection state change.
   * Keep the latest value to check the current state.
   */
  public onConnectionChanged = new BehaviorSubject(false);

  /**
   * Observe and store event reminders.
   */
  public onEventRemindersChanged = new BehaviorSubject<IEventReminder[]>([]);

  /**
   * Observe event reminder triggered.
   */
  public onEventReminderTriggered = new Subject<IEventReminder>();

  /**
   * Observe event reminder added.
   */
  public onEventReminderAdded = new Subject<IEventReminder>();

  constructor(private socket: Socket, private notification: NotificationService) {
    // Wait for connection
    this.socket.on('connect', () => {

      console.log('Connection to the backend successful!');
      this.onConnectionChanged.next(true);
    });

    // Receive all event reminders
    this.socket.on('Events', (events: IEventReminder[]) => {
      console.log('Received events', events);
      this.onEventRemindersChanged.next(events);
    });

    // Receive event reminder has triggered
    this.socket.on('EventReminderTriggered', async (event: IEventReminder, index: number) => {
      console.log('An event triggered', event, index);
      this.onEventRemindersChanged.value.splice(index, 1);
      this.onEventRemindersChanged.next(this.onEventRemindersChanged.value);
      this.onEventReminderTriggered.next(event);

      this.notification.send(event.title, event.message);
    });

    // Receive event reminder has been added
    this.socket.on('EventReminderAdded', (event: IEventReminder) => {
      console.log('An event has been added', event);
      this.onEventRemindersChanged.value.push(event);
      this.onEventRemindersChanged.next(this.onEventRemindersChanged.value);
      this.onEventReminderAdded.next(event);
    });

    // Handle disconnection
    this.socket.on('disconnect', () => {
      console.log('Connection to the backend lost...');
      this.onConnectionChanged.next(false);
    });
  }
  
  /**
   * Connect to the backend
   */
  public connect() {
    if (!this.connected) this.socket.connect();
  }

  /**
   * Disconnect from the backend
   */
  public disconnect() {
    if (this.connected) this.socket.disconnect();
  }

  /**
   * Send a new event reminder to add to the backend
   * @param event the event reminder to add
   * @returns true if it was sent
   */
  public sendNewEventReminder(event: IEventReminder) {
    if (!this.connected || event.triggerTime < Date.now()) return false;
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
  public createEventReminder(title: string, message: string, date: Date): IEventReminder {
    return {
      title,
      message,
      triggerTime: date.getTime()
    };
  }

}

export class EventReminderServiceMock implements IEventReminderService {
  get connected(): boolean {
    return false;
  }
  get events(): IEventReminder[] {
    return [];
  }
  onConnectionChanged = new BehaviorSubject<boolean>(false);
  onEventRemindersChanged = new Subject<IEventReminder[]>();
  onEventReminderTriggered = new Subject<IEventReminder>();
  onEventReminderAdded = new Subject<IEventReminder>();
  connect(): void {
    
  }
  disconnect(): void {
    
  }
  sendNewEventReminder(event: IEventReminder): boolean {
    return false;
  }
  createEventReminder(title: string, message: string, date: Date): IEventReminder {
    return {
      title, 
      message, 
      triggerTime: 0
    }
  }
  
}