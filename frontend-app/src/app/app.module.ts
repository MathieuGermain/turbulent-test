import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { InViewDirective } from './directives/in-view.directive';
import { OrderByPipe } from './pipes/order-by.pipe';

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
    CustomButtonComponent,
    InViewDirective,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule, SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
