import {Component} from '@angular/core';
import {FoodEntryService} from "../services/food-entry.service";
import {FoodEntry} from "../model";
import {FoodTagService} from "../services/food-tag.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  foodList: FoodEntry[] = [];

  constructor(
    private foodEntryService: FoodEntryService,
    private foodTagService: FoodTagService) {
  }

  searchFoodEntries(newHero: string) {
    this.foodEntryService.searchEntries(newHero)
      .subscribe({
        next: (data) => {
          this.foodList = data;
          console.log(this.foodList)
        },
        error: (e) => console.error(e)
      });
  }

  searchFoodTags(value: string) {
    this.foodEntryService.searchEntries(value)
      .subscribe({
        next: (data) => {
          this.foodList = data;
          console.log(this.foodList)
        },
        error: (e) => console.error(e)
      })

  }
}
