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
  foodList: FoodEntry[] = [];
  openTagForm = false;
  existingFoodTags: FoodTag[] = [];
  foodListSearch: FoodEntry[] = [];
  dayFoodList: FoodEntry[] = [];
  events: CalendarEvent[] = [];
  searchResult = false;
  selectedTags = new Set<number>();
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

  get ticketFormGroups() {
    return this.profileForm.controls.newTags.controls as FormGroup[];
  }

  ngOnInit(): void {
    this.getFoodTags();
    this.loadAllEntries();
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.updateDayEvents();
    this.view = CalendarView.Day;
  }

  createNewEntry() {
    this.getFoodTags();
    this.modalView = true;
    this.modalService.open('modal-1');
  }

  /**
   * For some reason they are the opposite in the library; day is a month and vise versa.
   * @param view
   */
  setView(view: any) {
    this.searchResult = false;
    console.log("changing view")
    this.foodListSearch = [];

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

  searchFoodEntries(value: string) {
    if (!value) {
      return;
    }
    this.foodEntryService.searchEntries(value)
      .subscribe({
        next: (data) => {
          this.foodListSearch = data;
          this.searchResult = this.foodListSearch.length === 0;
        },
        error: (e) => console.error(e)
      });
  }

  searchFoodTags(value: string) {
    if (!value) {
      return;
    }
    this.foodTagService.searchTags(value)
      .subscribe({
        next: (data) => {
          this.foodListSearch = data;
          this.searchResult = this.foodListSearch.length === 0;
        },
        error: (e) => console.error(e)
      })
  }

  handleDeleteFoodEntry(food: any) {
    console.log("food to delete", food.id);

    this.foodTagService.deleteFoodTagIdFromEntry(food.id)
      .subscribe({
        next: () => {
          this.foodEntryService.deleteEntry(food.id)
            .subscribe({
              next: () => {
                this.events = this.events.filter((e) => e !== food);
                this.dayFoodList = this.dayFoodList.filter((f) => f !== food);
              },
              error: (e) => console.error(e)
            });
        }
      })
  }

  onSubmit() {
    console.log("submit the form");
    this.modalView = false;
    let food = '';
    let date = new Date();

    if (this.profileForm.value.foodEntry && this.viewDate) {
      food = this.profileForm.value.foodEntry;
      date = this.viewDate;
    }
    let formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");
    let updatedTime = this.datePipe.transform(date, "hh:mm:ss");

    // save entry
    this.foodEntryService.saveEntry(food, formattedDate, updatedTime)
      .subscribe({
        next: (feRes) => {


          // save existing food tags:
          this.selectedTags.forEach(sc => {
            this.foodTagService.appendTag(feRes.id, sc)
              .subscribe({
                next: () => {
                  this.selectedTags.clear();
                  this.updateDayEvents();
                }
              })
          })


          // update calendar view
          this.updateCalendarEvents(feRes, food);


          this.profileForm?.value?.newTags.forEach(t => {
            this.foodTagService.saveTag(t.foodTagName, t.foodTagColor)
              .subscribe({
                next: (res) => {
                  this.updateDayEvents();
                  this.foodTagService.appendTag(feRes.id, res.id)
                    .subscribe({
                      next: () => {
                        this.updateDayEvents();
                      }
                    });
                },
                error: (e) => console.error(e)
              });
          });

          this.updateDayEvents();

          this.profileForm.reset();
          this.selectedTags.clear();
          (this.profileForm.get('newTags') as FormArray).clear();
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
          this.dayFoodList.forEach(e => {
            e.foodTagList = [...new Set(e.foodTagList)]
          })
          console.log("dayFoodList", this.dayFoodList);
        },
        error: (e) => console.error(e)
      });
  }

  removeTags(index: number) {
    (this.profileForm.get('newTags') as FormArray).removeAt(index);
    this.selectedTags.delete(index);
  }

  getElementTagStyle(foodTagColor: string): string {
    let color;
    if (foodTagColor != null) {
      color = tagLookUp.get(foodTagColor);
    }
    return 'badge ' + color;
  }

  addTag(): void {
    this.openTagForm = true;

    // @ts-ignore
    this.profileForm.controls.newTags.push(this.fb.group({
      foodTagName: ['', Validators.required],
      foodTagColor: ['', [Validators.required]]
    }));
  }

  deleteTag(id: number) {
    console.log("tag id to delete: ", id);
    this.foodTagService.deleteTag(id)
      .subscribe({
        next: () => {
          this.selectedTags.delete(id);
          this.getFoodTags();
        },
        error: (e) => console.error(e)
      });
  }

  selectTag(id: number) {
    this.selectedTags.add(id);
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

  clearForm() {
    console.log("clear form");
    this.profileForm.reset();
    (this.profileForm.get('newTags') as FormArray).clear();
  }

  private getFoodTags() {
    this.foodTagService.getAllTags()
      .subscribe({
        next: (data) => {
          console.log("tags", data);
          this.existingFoodTags = data;
        },
        error: (e) => console.error(e)
      })
  }

  private updateCalendarEvents(feRes: FoodEntry, food: string) {
    let formattedDate = feRes.foodEntryDate + ' '
    this.events = [
      ...this.events,
      {
        title: food,
        start: formattedDate ? new Date(formattedDate) : new Date(),
        id: feRes?.id,
      }
    ];
  }

  private loadAllEntries() {
    this.foodEntryService.getAllEntries()
      .subscribe({
        next: (data) => {
          this.foodList = data;
          console.log("load all entries", this.foodList);
          this.loadFoodEntries(this.foodList);
        },
        error: (e) => console.error(e)
      });
  }
}
