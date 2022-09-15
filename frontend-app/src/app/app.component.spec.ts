import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { EventReminderService, EventReminderServiceMock } from "./services/event-reminder.service";

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let eventReminderService: EventReminderService

describe('AppComponent', () => {

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
          { provide: EventReminderService, useClass: EventReminderServiceMock },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  
    eventReminderService = TestBed.inject(EventReminderService);
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

})
