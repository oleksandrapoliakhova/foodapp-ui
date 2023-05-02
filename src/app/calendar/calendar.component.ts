import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
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
  tagForm = false;
  foodList: FoodEntry[] = [];
  events: CalendarEvent[] = [];
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any> | undefined;

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
    this.modalView = false;
    let food = '';
    let date = new Date();

    if (this.profileForm.value.foodEntry && this.viewDate) {
      food = this.profileForm.value.foodEntry;
      date = this.viewDate;
    }

    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");
    let updatedTime = this.datePipe.transform(date, "hh:mm:ss");

    this.foodEntryService.saveEntry(food, formattedDate, updatedTime)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.events = [
            ...this.events,
            {
              title: food,
              start: new Date(),
              id: res?.id,
            }
          ];
          this.profileForm.reset();
        },
        error: (e) => console.error(e)
      });
  }

  handleDeleteFoodEntry(food: CalendarEvent) {
    console.log(food);
    this.foodEntryService.deleteEntry(food.id)
      .subscribe({
        next: () => {
          this.events = this.events.filter((iEvent) => iEvent !== food);
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
          start: dateData,
          id: f.id
        }
      ];
    });
  }

  openTagForm() {
    this.tagForm = true;
  }

  getFilteredEvents(events: CalendarEvent[]) {
    return events.filter(e => e.start.toLocaleDateString('sv') === this.viewDate.toLocaleDateString('sv'));
  }
}
