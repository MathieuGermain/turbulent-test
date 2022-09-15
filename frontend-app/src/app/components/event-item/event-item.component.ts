import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { interval, Subscription } from 'rxjs';
import { IEventReminder } from 'src/app/services/event-reminder.service';

@Component({
  selector: 'event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
  animations: [
    trigger('visible', [
      state('false', style({ transform: 'translateY(100%)', opacity: 0 })),
      state('true', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('* => *', animate('300ms'))
    ])
  ]
})
export class EventItemComponent implements OnInit, OnDestroy {

  @Input() event!: IEventReminder;

  private update!: Subscription;
  
  public visibility = false;
  public timeLeft!: string;

  constructor() { }

  private updateTimeLeft() {
    const value = (this.event.triggerTime - Date.now()) / 1000;
    if (value >= 0) {
      const hours: number = Math.floor(value / 3600);
      const minutes: number = Math.floor((value % 3600) / 60);
      this.timeLeft = ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    }
    else this.timeLeft = "00:00:00";
  }

  visibilityChanged(visibility: boolean) {
    if (visibility)
      this.visibility = visibility;
  }

  ngOnInit(): void {
    this.updateTimeLeft();
    this.update = interval(333.333).subscribe(() => this.updateTimeLeft());
  }

  ngOnDestroy(): void {
    this.update?.unsubscribe();
  }
}

