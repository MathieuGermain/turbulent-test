import { AfterViewInit, Directive, ElementRef, EventEmitter, Host, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[InView]'
})
export class InViewDirective implements AfterViewInit, OnDestroy {

  @Output() visibilityChange = new EventEmitter<boolean>();
  private _observer!: IntersectionObserver;

  constructor(@Host() private _elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5
    };
    this._observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => this.visibilityChange.emit(entry.isIntersecting));
    }, options);
    this._observer.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy() {
    this._observer.disconnect();
  }

}
