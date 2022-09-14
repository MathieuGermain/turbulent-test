import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDatepicker } from '@angular/material/datepicker';

import { AddeventOverlayComponent } from './addevent-overlay.component';

describe('AddeventOverlayComponent', () => {
  let component: AddeventOverlayComponent;
  let fixture: ComponentFixture<AddeventOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddeventOverlayComponent,
        MatDatepicker,
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
