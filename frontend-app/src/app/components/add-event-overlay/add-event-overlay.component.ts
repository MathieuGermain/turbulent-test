import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { EventReminderService } from 'src/app/services/event-reminder.service';

@Component({
  selector: 'add-event-overlay',
  templateUrl: './add-event-overlay.component.html',
  styleUrls: ['./add-event-overlay.component.scss']
})
export class AddEventOverlayComponent implements OnInit, OnDestroy {

  @Input() opened: boolean = false;
  @Output() openedChange = new EventEmitter<boolean>();

  @ViewChild('picker') picker!: NgxMatDatetimePicker<any>;

  title: string = "";
  message: string = "";
  selectedDate = new FormControl<Date>(new Date());
  minDate: Date = new Date();

  private updateMinTime!: Subscription;

  constructor(private service: EventReminderService) { }

  ngOnInit(): void {
    this.updateMinTime = interval(1000).subscribe(() => {
      this.minDate = new Date();
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
    const event = this.service.createEventReminder(this.title, this.message, this.selectedDate.value || new Date());
    if (this.service.sendNewEventReminder(event)) {
      this.title = '';
      this.message = '';
      this.close();
    }
  }

  close() {
    this.opened = false;
    this.openedChange.next(this.opened);
  }

}
