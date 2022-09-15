import { Component, Input, OnInit } from '@angular/core';
import { INotification } from 'src/app/services/notification.service';

@Component({
  selector: 'notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

  @Input() notification!: INotification;

  constructor() { }

  ngOnInit(): void {
  }

}
