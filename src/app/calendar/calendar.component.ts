import {Component, OnInit} from '@angular/core';
import {startOfDay} from 'date-fns';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {User} from "../model";
import {AccountService} from "../services/account.service";
import {ModalService} from "../services/modal.service";
import {FormBuilder, Validators} from "@angular/forms";
import * as moment from "moment";


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

export class CalendarComponent implements OnInit {
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

  profileForm = this.fb.group({
    foodEntry: ['', Validators.required]
  });

  constructor(private accountService: AccountService, public modalService: ModalService, private fb: FormBuilder) {
    this.user = this.accountService.userValue;
  }

  ngOnInit() {
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  logout() {
    this.accountService.logout();
  }

  dayClicked({date}: { date: Date }): void {

    this.modalView = true;
    this.modalService.open('modal-1')

    this.bodyText = "123";
    this.dayTime = date;
  }

  onSubmit(date: any) {
    // TODO: Use EventEmitter with form value
    let entryTimeStamp = new Date();
    console.log("entryTimeStamp" + entryTimeStamp);

    console.warn(this.profileForm.value);
    console.warn(date);

    let food = '';

    let newDateObj = moment(entryTimeStamp).add(30, 'm').toDate();
    console.log("newDateObj" + newDateObj);

    if (this.profileForm.value.foodEntry) {
      food = this.profileForm.value.foodEntry;
    }

    this.events = [
      ...this.events,
      {
        title: food,
        start: entryTimeStamp,
        end: newDateObj,
        color: this.colors.blue,
        draggable: true,
      }
    ];

    this.profileForm.reset();
  }
}
