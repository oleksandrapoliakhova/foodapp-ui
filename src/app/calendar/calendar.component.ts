import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {CreationFoodTag, FoodEntry, FoodTag, tagLookUp} from "../model";
import {ModalService} from "../services/modal.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FoodEntryService} from "../services/food-entry.service";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FoodTagService} from "../services/food-tag.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  creationFoodTags: CreationFoodTag[] = []
  CalendarView = CalendarView;
  modalView = false;
  public elementTag: string
  foodList: FoodEntry[] = [];
  openTagForm = false;
  dayFoodList: FoodEntry[] = [];
  events: CalendarEvent[] = [];
  searchView = false;
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any> | undefined;
  profileForm = this.fb.group({
    foodEntry: ['', Validators.required],
    newTags: new FormArray([])
  });

  constructor(
    private foodEntryService: FoodEntryService,
    private foodTagService: FoodTagService,
    public modalService: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
  }

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

  // convenience getters for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  handleDeleteFoodEntry(food: any) {
    this.foodEntryService.deleteEntry(food.id)
      .subscribe({
        next: () => {
          this.events = this.events.filter((e) => e !== food);
          this.dayFoodList = this.dayFoodList.filter((f) => f !== food);
        },
        error: (e) => console.error(e)
      });
  }

  get t() {
    return this.f.newTags as unknown as FormArray;
  }

  onSearch($event: boolean) {
    this.searchView = $event;
  }

  get ticketFormGroups() {
    return this.t.controls as FormGroup[];
  }

  onSubmit() {
    this.modalView = false;
    let food = '';
    let date = new Date();

    if (this.profileForm.value.foodEntry && this.viewDate) {
      food = this.profileForm.value.foodEntry;
      date = this.viewDate;
    }

    console.log("this.profileForm.value");
    console.log(this.profileForm.value);

    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");
    let updatedTime = this.datePipe.transform(date, "hh:mm:ss");

    // save entry
    this.foodEntryService.saveEntry(food, formattedDate, updatedTime)
      .subscribe({
        next: (feRes) => {

          this.updateDayEvents();

          // update calendar view
          let formattedDate = feRes.foodEntryDate + ' '
          this.events = [
            ...this.events,
            {
              title: food,
              start: formattedDate ? new Date(formattedDate) : new Date(),
              id: feRes?.id,
            }
          ];

          if (this.profileForm?.value?.newTags) {
            this.creationFoodTags = this.profileForm.value.newTags;
          }

          // save new food tags
          this.creationFoodTags.forEach(t => {

            this.foodTagService.saveTag(t.foodTagName, t.foodTagColor)
              .subscribe({
                next: (res) => {
                  this.updateDayEvents();
                  this.foodTagService.appendTag(feRes.id, res.id)
                    .subscribe({
                      next: (res) => {
                        console.log(res);
                      }
                    });
                },
                error: (e) => console.error(e)
              });
          });

          this.profileForm.reset();
          this.profileForm.controls.newTags.reset();

        },
        error: (e) => console.error(e)
      });
  }

  /**
   * Get food by date in this format: 2023-09-09
   */
  updateDayEvents() {
    let date = this.viewDate.toLocaleDateString('sv');

    this.foodEntryService.getDayEntries(date)
      .subscribe({
        next: (data) => {
          this.dayFoodList = data;
          console.log("dayFoodList", this.dayFoodList);
        },
        error: (e) => console.error(e)
      });
  }

  updateFoodEntry(e: FoodEntry) {
    // todo
    this.createNewEntry();
  }

  addTag(): void {
    this.openTagForm = true;

    // @ts-ignore
    this.profileForm.controls.newTags.push(this.fb.group({
      foodTagName: ['', Validators.required],
      foodTagColor: ['', [Validators.required]]
    }));
  }

  removeTags(index: number) {
    (this.profileForm.get('newTags') as FormArray).removeAt(index);
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

  getElementTag(tag: FoodTag) {
    let color;
    if (tag.foodTagColor != null) {
      color = tagLookUp.get(tag.foodTagColor);
      console.log(color);
    }
    return `<h6><span class="badge ${color}">${tag.foodTagName}</span></h6>`;
  }
}
