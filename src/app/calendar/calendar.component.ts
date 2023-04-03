import {Component} from '@angular/core';
import {endOfDay, startOfDay} from 'date-fns';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {User} from "../model";
import {AccountService} from "../services/account.service";
import {ModalService} from "../services/modal.service";

let testdata = {
  "id": 1,
  "foodEntry": "rerffe",
  "foodEntryDate": "2007-12-03",
  "updatedTime": "13:57:23.166637",
  "foodTagList": []
}


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
  modalView = false;
  bodyText: string | undefined;
  dayTime: Date | undefined;

  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

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

  constructor(private accountService: AccountService, public modalService: ModalService) {
    this.user = this.accountService.userValue;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  logout() {
    this.accountService.logout();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);

    this.modalView = true;

    this.modalService.open('modal-1')

    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(date),
        end: endOfDay(date),
        color: this.colors.red,
        draggable: true,
      }
    ];

    this.bodyText = "hola";
    this.dayTime = date;

    //let x=this.adminService.dateFormat(date)
    //this.openAppointmentList(x)
  }
}
