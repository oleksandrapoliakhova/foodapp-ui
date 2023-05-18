import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {FlatpickrModule} from 'angularx-flatpickr';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {CalendarComponent} from './calendar';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AlertComponent} from './alert';
import {AccountModule} from "./account/account.module";
import {ErrorInterceptor, JwtInterceptor} from "./auth-helper";
import {FoodEntryModalComponent} from './food-entry-modal';
import {ColorDirective} from './directives/color.directive';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AccountModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ReactiveFormsModule,
  ],
  declarations: [AppComponent,
    CalendarComponent, AlertComponent, FoodEntryModalComponent, ColorDirective],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ]
})
export class AppModule {
}
