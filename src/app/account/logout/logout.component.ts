import {Component} from '@angular/core';
import {first} from "rxjs/operators";
import {AccountService} from "../../services/account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  user: User | null;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
    this.user = this.accountService.userValue;
  }

  logout() {
    this.accountService.logout()
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['../login'], {relativeTo: this.route});
        },
        error: (error: any) => {
          console.log('Logout not successful', error)
        }
      });
  }
}
