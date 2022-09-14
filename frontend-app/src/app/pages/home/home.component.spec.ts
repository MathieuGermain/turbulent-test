import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventReminderService, EventReminderServiceMock } from '../../services/event-reminder-service.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: EventReminderService, useValue: new EventReminderServiceMock() }
      ],
      declarations: [ HomeComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
