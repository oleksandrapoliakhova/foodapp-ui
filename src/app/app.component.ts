import {Component} from '@angular/core';
import {User} from "./model";

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent {
  user?: User | null;
}
