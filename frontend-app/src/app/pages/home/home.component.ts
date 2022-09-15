import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventReminderService, IEventReminder } from 'src/app/services/event-reminder-service.service';

@Component({
  selector: 'page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  sortedEvents: IEventReminder[] = [];
  overlayOpened: boolean = false;

  get events() {
    return this.service.events;
  }

  private onEventsChangedSub!: Subscription;

  constructor(private service: EventReminderService) { }

  ngOnInit(): void {
    this.onEventsChangedSub = this.service.onEventRemindersChanged.subscribe((updatedEvents) => {
      this.sortedEvents = updatedEvents.concat().sort((a, b) => a.triggerTime - b.triggerTime);
    });
  }

  ngOnDestroy(): void {
    this.onEventsChangedSub?.unsubscribe();
  }

}
