import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarView} from 'angular-calendar';
import {FoodEntry} from "../model";
import {ModalService} from "../services/modal.service";
import {FormBuilder, Validators} from "@angular/forms";
import {FoodEntryService} from "../services/food-entry.service";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  modalView = false;
  dayTime: Date | undefined;
  foodList: FoodEntry[] = [];
  events: CalendarEvent[] = [];
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any> | undefined;


  colors: any = {
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    }
  };

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  constructor(
    private foodEntryService: FoodEntryService,
    public modalService: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
  }

  profileForm = this.fb.group({
    foodEntry: ['', Validators.required]
  });

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
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

  createNewEntry() {
    this.modalView = true;
    this.modalService.open('modal-1');
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  setView(view: CalendarView) {
    this.view = view;
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

    if (this.profileForm.value.foodEntry && this.viewDate) {
      food = this.profileForm.value.foodEntry;
      date = this.viewDate;
    }

    this.events = [
      ...this.events,
      {
        title: food,
        start: date,
        actions: this.actions,
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
          actions: this.actions,
          start: dateData,
        }
      ];
    });
  }
}
