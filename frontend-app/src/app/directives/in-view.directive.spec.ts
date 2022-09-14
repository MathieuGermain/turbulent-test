import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InViewDirective } from './in-view.directive';

@Component({
  selector: 'my-test-component',
  template: '<a class="mytag" InView>test</a>'
})
export class TestComponent {
  color:string = 'blue';
}

describe('InViewDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent, InViewDirective ]
    });
  
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // initial binding
    inputEl = fixture.debugElement.query(By.css('.mytag'));
  });

  it('should create an instance', () => {
    const directive = new InViewDirective(inputEl);
    expect(directive).toBeTruthy();
  });
});
