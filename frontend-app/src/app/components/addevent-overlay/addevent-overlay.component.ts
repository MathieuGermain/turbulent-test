import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { EventReminderService } from 'src/app/services/event-reminder-service.service';

@Component({
  selector: 'addevent-overlay',
  templateUrl: './addevent-overlay.component.html',
  styleUrls: ['./addevent-overlay.component.scss']
})
export class AddeventOverlayComponent implements OnInit, OnDestroy {

  @Input() opened!: boolean;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('picker') picker!: NgxMatDatetimePicker<any>;

  title!: string;
  message!: string;
  selectedDate = new FormControl<Date>(new Date());
  minDate!: Date;

  private updateMinTime!: Subscription;

  constructor(private service: EventReminderService) { }

  ngOnInit(): void {
    this.updateMinTime = interval(100).subscribe(() => {
      this.minDate = new Date(Date.now() + 1000);
      if (!this.selectedDate.value || this.selectedDate.value.getTime() < Date.now()) {
        this.selectedDate.setValue(this.minDate);
      }
    });
  }

  ngOnDestroy(): void {
    this.updateMinTime?.unsubscribe();
  }

  isValid() {
    return this.title && this.title.length > 0 && 
    this.message && this.message.length > 0 && 
    this.selectedDate.value instanceof Date && this.selectedDate.value.getTime() >= Date.now();
  }

  create() {
    const event = this.service.CreateEventReminder(this.title, this.message, this.selectedDate.value || new Date());
    if (this.service.AddEventReminder(event)) {
      this.title = '';
      this.message = '';
      this.close();
    }
  }

  close() {
    this.closed.next();
  }

}
