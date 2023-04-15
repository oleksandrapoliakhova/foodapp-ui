import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common'
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {RouterLink} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ]
})
export class AccountModule {
}
