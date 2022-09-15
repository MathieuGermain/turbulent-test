import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { INotification, NotificationService } from 'src/app/services/notification.service';
import { Howl } from 'howler';

@Component({
  selector: 'notification-overlay',
  templateUrl: './notification-overlay.component.html',
  styleUrls: ['./notification-overlay.component.scss'],
  animations: [
    trigger('notificationAnimation', [

      state('in', style({ opacity: 1, transform: 'translateX(0)' })),

      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%)'}),
        animate(200)
      ]),
      
      transition(':leave', animate(200, style({
          opacity: 0, transform: 'translateX(-100%)'
      })))
    ])
  ]
})
export class NotificationOverlayComponent implements OnInit, OnDestroy {

  public notifications: INotification[] = [];

  private onNotificationAddedSub!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.onNotificationAddedSub = this.notificationService.onNotificationAdded.subscribe((notification) => this.addNotification(notification));
  }

  private addNotification(notification: INotification) {
    this.notifications.push(notification);

    new Howl({
      src: ['assets/audio/pop.mp3', 'assets/audio/pop.wav', 'assets/audio/pop.ogg'],
      format: ['mp3', 'wav', 'ogg'],
      autoplay: true,
    });
  }

  ngOnDestroy(): void {
    this.onNotificationAddedSub?.unsubscribe();
  }

  closeNotification(index: number) {
    if (this.notifications[index]) this.notifications.splice(index, 1);
  }

}
