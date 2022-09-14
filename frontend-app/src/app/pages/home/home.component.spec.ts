import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddeventOverlayComponent } from 'src/app/components/addevent-overlay/addevent-overlay.component';
import { EventListComponent } from 'src/app/components/event-list/event-list.component';
import { OrderByPipe } from 'src/app/pipes/order-by.pipe';
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
      declarations: [
        HomeComponent,
        AddeventOverlayComponent,
        EventListComponent,
        OrderByPipe
      ],
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
