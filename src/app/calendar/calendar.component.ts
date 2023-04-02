import {Component} from '@angular/core';
import {startOfDay} from 'date-fns';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {User} from "../model";
import {AccountService} from "../services/account.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  user: User | null;
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'First event',
    },
    {
      start: startOfDay(new Date()),
      title: 'Second event',
    }
  ]

  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    //let x=this.adminService.dateFormat(date)
    //this.openAppointmentList(x)
  }
}
