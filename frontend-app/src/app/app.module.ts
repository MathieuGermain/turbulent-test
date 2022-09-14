import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

// App

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Pages

import { HomeComponent } from './pages/home/home.component';

// Components

import { NavbarComponent } from './components/navbar/navbar.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { AddeventOverlayComponent } from './components/addevent-overlay/addevent-overlay.component';

// Directives

import { InViewDirective } from './directives/in-view.directive';

// Pipes

import { OrderByPipe } from './pipes/order-by.pipe';

// SocketIO

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'http://localhost:3344',
  options: {
    autoConnect: false,
    reconnection: true
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
    OrderByPipe,
    AddeventOverlayComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
