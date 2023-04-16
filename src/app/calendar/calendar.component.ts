import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {FoodEntry, User} from "../model";
import {AccountService} from "../services/account.service";
import {ModalService} from "../services/modal.service";
import {FormBuilder, Validators} from "@angular/forms";
import {FoodEntryService} from "../services/food-entry.service";
import {DatePipe} from "@angular/common";

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
  dayTime: Date | undefined;
  foodList: FoodEntry[] = [];
  events: CalendarEvent[] = [];

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

  profileForm = this.fb.group({
    foodEntry: ['', Validators.required]
  });

  constructor(private accountService: AccountService,
              private foodEntryService: FoodEntryService,
              public modalService: ModalService,
              private datePipe: DatePipe,
              private fb: FormBuilder) {

    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.foodEntryService.getAllEntries()
      .subscribe({
        next: (data) => {
          this.foodList = data;
          this.loadFoodEntries(this.foodList);
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  dayClicked({date}: { date: Date }): void {
    this.modalView = true;
    this.modalService.open('modal-1');
    this.dayTime = date;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  logout() {
    this.accountService.logout();
  }

  saveFoodEntry(food: string, date: Date): void {

    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");

    this.foodEntryService.saveEntry(food, formattedDate)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => console.error(e)
      });
  }

  onSubmit() {
    let food = '';
    // todo not ideal solution
    let date = new Date();

    if (this.profileForm.value.foodEntry && this.dayTime) {
      food = this.profileForm.value.foodEntry;
      date = this.dayTime;
    }

    this.events = [
      ...this.events,
      {
        title: food,
        start: date,
        color: this.colors.blue
      }
    ];

    this.saveFoodEntry(food, date);
    this.profileForm.reset();
  }

  private loadFoodEntries(foodList: any[]) {

    foodList.forEach(f => {
      let dateData = new Date(f.foodEntryDate.split('-'));

      this.events = [
        ...this.events,
        {
          title: f.foodEntry,
          start: dateData,
        }
      ];
    });
  }
}
