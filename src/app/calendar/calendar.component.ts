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

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleEventFoodEntry('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleDeleteFoodEntry(event);
      },
    },
  ];

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  constructor(
    private foodEntryService: FoodEntryService,
    public modalService: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
  }

  handleEventFoodEntry(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    if (action === 'Deleted') {
      console.log(action);
    }
    if (action === 'Edited') {
      // upon edit open the modal
      this.modal.open(this.modalContent, {size: 'lg'});
    }
  }

  profileForm = this.fb.group({
    foodEntry: ['', Validators.required]
  });

  ngOnInit(): void {

    this.foodEntryService.getAllEntries()
      .subscribe({
        next: (data) => {
          this.foodList = data;
          this.loadFoodEntries(this.foodList);
        },
        error: (e) => console.error(e)
      });
  }

  saveFoodEntry(food: string, date: Date): FoodEntry | undefined {

    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");
    let savedFoodEntry;

    this.foodEntryService.saveEntry(food, formattedDate)
      .subscribe({
        next: (res) => {
          console.log(res);
          savedFoodEntry = res;
        },
        error: (e) => console.error(e)
      });

    return savedFoodEntry;
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

  onSubmit() {
    let food = '';
    // todo not ideal solution
    let date = new Date();

    if (this.profileForm.value.foodEntry && this.viewDate) {
      food = this.profileForm.value.foodEntry;
      date = this.viewDate;
    }

    // save to get the id value:
    // todo reload on addition?
    let foodEntry = this.saveFoodEntry(food, date);

    this.events = [
      ...this.events,
      {
        title: food,
        start: date,
        id: foodEntry?.id,
        actions: this.actions,
        color: {
          primary: '#1e90ff',
          secondary: '#D1E8FF'
        }
      }
    ];

    this.profileForm.reset();
  }

  private handleDeleteFoodEntry(event: CalendarEvent<any>) {
    console.log(event);
    this.foodEntryService.deleteEntry(event.id)
      .subscribe({
        next: () => {
          this.events = this.events.filter((iEvent) => iEvent !== event);
        },
        error: (e) => console.error(e)
      });
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
          id: f.id
        }
      ];
    });
  }
}
