import { Component } from '@angular/core';
import { EventReminderService } from './services/event-reminder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  get connected() {
    return this.eventReminderService.connected;
  }

  constructor(private eventReminderService: EventReminderService) {}
}
