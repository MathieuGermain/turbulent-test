import { Component } from '@angular/core';
import { EventReminderService } from './services/event-reminder-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(service: EventReminderService) {
    service.Connect();
  }
}
