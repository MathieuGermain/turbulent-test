import { NgxMatDatetimePicker, NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddeventOverlayComponent } from './addevent-overlay.component';
import { EventReminderService, EventReminderServiceMock } from '../../services/event-reminder-service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddeventOverlayComponent', () => {
  let component: AddeventOverlayComponent;
  let fixture: ComponentFixture<AddeventOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: EventReminderService, useValue: new EventReminderServiceMock() }
      ],
      imports: [
        MatCommonModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        NgxMatNativeDateModule,
        NgxMatDatetimePickerModule
      ],
      declarations: [
        AddeventOverlayComponent,
        NgxMatDatetimePicker,
        MatDatepickerToggle
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeventOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
