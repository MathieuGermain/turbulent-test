import { Component, OnInit } from '@angular/core';
import { EventReminderService } from 'src/app/services/event-reminder-service.service';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  overlayOpened!: boolean

  constructor(private eventReminder: EventReminderService) { }

  public get events() {
    return this.eventReminder.Events;
  }

  ngOnInit(): void {

  }

}
