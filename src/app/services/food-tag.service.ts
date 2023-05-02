import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FoodEntry, FoodEntryResponse, User} from "../model";
import {environment} from "../../environments/environemnt";


@Injectable({providedIn: 'root'})
export class FoodTagService {
  public user: Observable<User | null>;
  private userSubject: BehaviorSubject<User | null>;

  constructor(
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  saveTag(foodEntry: string, foodEntryDate: string | null) {
    return this.http.post <FoodEntry>(`${environment.apiUrl}/food-entry/save-food-entry`, {foodEntry, foodEntryDate})
  }

  deleteTag(foodEntryId: any): Observable<any> {
    let id = foodEntryId.toString();
    return this.http.delete <FoodEntry>(`${environment.apiUrl}/food-entry/delete-food-entry/${id}`, {})
  }

  getAllTags(): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/get-all-food-entries`)
  }

  searchTags(stringSearch: string): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/search-food-entries/${stringSearch}`)
  }
}
