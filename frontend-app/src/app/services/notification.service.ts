import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface INotification {
  title: string,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Verify if the Notification API is available in this browser.
   */
  public get available() {
    return "Notification" in window;
  }

  /**
   * Verify if the permission permission was granted
   */
  public get granted() {
    return this.notificationPermission === 'granted';
  }

  /**
   * Trigger on new in-site notification added
   */
  public onNotificationAdded = new Subject<INotification>();

  private notificationPermission!: NotificationPermission;

  constructor() {
    if (localStorage.getItem('EventReminderNotificationEnabled') === 'true') this.enable();
  }

  /**
   * Enable notification, request the user to grant the permission.
   * @returns 
   */
  public async enable() {
    if (!this.available) return;
    this.notificationPermission = await Notification.requestPermission();
    localStorage.setItem('EventReminderNotificationEnabled', String(this.granted));
  }

  /**
   * Add a in-site notification and optionally send a notification if available and permission is granted.
   * @param title notification title
   * @param message notification message
   * @param webNotificationOptions notification options to overwrite
   * @returns return the browser notification instance if available
   */
  public async send(title: string, message: string, webNotificationOptions?: NotificationOptions) {
    // In website notification
    this.onNotificationAdded.next({ title, message });

    // Browser notification
    if (this.available && this.granted) {
      const opts = Object.assign({ body: message }, webNotificationOptions);
      return new Notification(title, opts);
    }

    return;
  }
  
}
