import {Component, EventEmitter, Output} from '@angular/core';
import {FoodEntryService} from "../services/food-entry.service";
import {FoodEntry} from "../model";
import {FoodTagService} from "../services/food-tag.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() searchResults = new EventEmitter<boolean>();

  foodList: FoodEntry[] = [];

  constructor(
    private foodEntryService: FoodEntryService,
    private foodTagService: FoodTagService) {
  }

  searchFoodEntries(value: string) {
    this.foodEntryService.searchEntries(value)
      .subscribe({
        next: (data) => {
          this.foodList = data;
          this.emitSearchResult();
        },
        error: (e) => console.error(e)
      });
  }

  searchFoodTags(value: string) {
    this.foodTagService.searchTags(value)
      .subscribe({
        next: (data) => {
          this.foodList = data;
          this.emitSearchResult();
        },
        error: (e) => console.error(e)
      })
  }

  /**
   * if foodList os present emit true
   */
  private emitSearchResult() {
    if (this.foodList.length != 0) {
      this.searchResults.emit(true);
    }
  }
}
