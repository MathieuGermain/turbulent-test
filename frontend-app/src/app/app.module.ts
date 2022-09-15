import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Pages

import { HomeComponent } from './pages/home/home.component';

// Components

import { NavbarComponent } from './components/navbar/navbar.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { AddeventOverlayComponent as AddEventOverlayComponent } from './components/add-event-overlay/add-event-overlay.component';

// Directives

import { InViewDirective } from './directives/in-view.directive';

// SocketIO

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ConnectionOverlayComponent } from './components/connection-overlay/connection-overlay.component';
import { MaterialModule } from './material.module';

const config: SocketIoConfig = {
  url: 'http://localhost:3344',
  options: {
    autoConnect: true,
    reconnection: true,
    rememberUpgrade: true
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    EventListComponent,
    EventItemComponent,
    InViewDirective,
    AddEventOverlayComponent,
    ConnectionOverlayComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
