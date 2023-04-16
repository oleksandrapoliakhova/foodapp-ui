import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common'
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {RouterLink} from "@angular/router";
import {LogoutComponent} from './logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  exports: [
    LogoutComponent
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent
  ]
})
export class AccountModule {
}
