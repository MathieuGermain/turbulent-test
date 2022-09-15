import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'connection-overlay',
  templateUrl: './connection-overlay.component.html',
  styleUrls: ['./connection-overlay.component.scss']
})
export class ConnectionOverlayComponent implements OnInit {

  @Input() opened: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
