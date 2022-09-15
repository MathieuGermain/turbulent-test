import { Component, Input, OnInit } from '@angular/core';
import { IEventReminder } from 'src/app/services/event-reminder-service.service';

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  @Input() events: IEventReminder[] = [];

  constructor() { }

  ngOnInit(): void {

  }

}
