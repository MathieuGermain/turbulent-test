import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventReminderService, IEventReminder } from 'src/app/services/event-reminder-service.service';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  overlayOpened: boolean = false;
  events: IEventReminder[] = [];

  private onEventsUpdateSub!: Subscription;

  constructor(private eventReminder: EventReminderService) { }

  ngOnInit(): void {
    this.onEventsUpdateSub = this.eventReminder.onEventUpdate.subscribe((events) => this.events = events);
  }

  ngOnDestroy(): void {
    this.onEventsUpdateSub?.unsubscribe();
  }

}
