import {Component} from '@angular/core';
import {User} from "./model";
import {AccountService} from "./services/account.service";

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent {
  user?: User | null;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}
