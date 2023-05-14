import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {FoodEntry} from "../model";
import {ModalService} from "../services/modal.service";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
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
  foodList: FoodEntry[] = [];
  openTagForm = false;
  dayFoodList: FoodEntry[] = [];
  events: CalendarEvent[] = [];
  searchView = false;
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any> | undefined;

  constructor(
    private foodEntryService: FoodEntryService,
    public modalService: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
  }

  profileForm = this.fb.group({
    foodEntry: ['', Validators.required],
    name: [],
    tag: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadAllEntries();
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.updateDayEvents();
    this.view = CalendarView.Day;
  }

  createNewEntry() {
    this.modalView = true;
    this.modalService.open('modal-1');
  }

  /**
   * For some reason they are the opposite in the library; day is a month and vise versa.
   * @param view
   */
  setView(view: CalendarView) {
    console.log("changing view")
    this.searchView = false;

    if (this.view === 'month') {
      this.foodList = [];
      this.updateDayEvents();
    }
    if (this.view === 'day') {
      this.events = [];
      this.loadAllEntries();
    }
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

    console.log(this.profileForm.value.name);
    console.log(this.profileForm.value.tag);

    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");
    let updatedTime = this.datePipe.transform(date, "hh:mm:ss");

    this.foodEntryService.saveEntry(food, formattedDate, updatedTime)
      .subscribe({
        next: (res) => {

          this.updateDayEvents();

          // update calendar view
          console.log(res);
          let formattedDate = res.foodEntryDate + ' '
          this.events = [
            ...this.events,
            {
              title: food,
              start: formattedDate ? new Date(formattedDate) : new Date(),
              id: res?.id,
            }
          ];
          this.profileForm.reset();
        },
        error: (e) => console.error(e)
      });
  }

  handleDeleteFoodEntry(food: any) {
    console.log(food);
    this.foodEntryService.deleteEntry(food.id)
      .subscribe({
        next: () => {
          this.events = this.events.filter((e) => e !== food);
          this.dayFoodList = this.dayFoodList.filter((f) => f !== food);
        },
        error: (e) => console.error(e)
      });
  }

  /**
   * Get food by date in this format: 2023-09-09
   */
  updateDayEvents() {
    console.log("updateDayEvents", this.viewDate)
    let date = this.viewDate.toLocaleDateString('sv');

    this.foodEntryService.getDayEntries(date)
      .subscribe({
        next: (data) => {
          this.dayFoodList = data;
          console.log(this.dayFoodList);
        },
        error: (e) => console.error(e)
      });
  }

  onSearch($event: boolean) {
    this.searchView = $event;
  }

  updateFoodEntry(e: FoodEntry) {
    console.log(e);
    this.createNewEntry();
  }

  addTag(): void {
    console.log("add tag");
    this.openTagForm = true;
    (this.profileForm.get('tag') as FormArray).push(
      this.fb.control(null)
    )
  }

  removeTags(index: number) {
    (this.profileForm.get('tag') as FormArray).removeAt(index);
  }

  getTagsFormControls(): any {
    return (<FormArray>this.profileForm.get('tag')).controls
  }

  private loadAllEntries() {
    this.foodEntryService.getAllEntries()
      .subscribe({
        next: (data) => {
          this.foodList = data;
          this.loadFoodEntries(this.foodList);
        },
        error: (e) => console.error(e)
      });
  }

  /**
   * Load food entries into a calendar view
   * @param foodList
   * @private
   */
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
}
