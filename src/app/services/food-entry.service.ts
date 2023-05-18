import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FoodEntry, FoodEntryResponse, User} from "../model";
import {environment} from "../../environments/environemnt";


@Injectable({providedIn: 'root'})
export class FoodEntryService {
  public user: Observable<User | null>;
  private userSubject: BehaviorSubject<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  saveEntry(foodEntry: string, foodEntryDate: string | null, updatedTime: string | null) {
    return this.http.post <FoodEntry>(`${environment.apiUrl}/food-entry/save-food-entry`,
      {foodEntry, foodEntryDate, updatedTime})
  }

  updateEntry(foodEntry: { id: string | number | undefined; foodEntry: string }) {
    return this.http.post <FoodEntry>(`${environment.apiUrl}/food-entry/update-food-entry`, {foodEntry})
  }

  deleteEntry(foodEntryId: any): Observable<any> {
    let id = foodEntryId.toString();
    return this.http.delete <FoodEntry>(`${environment.apiUrl}/food-entry/delete-food-entry/${id}`, {})
  }

  getAllEntries(): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/get-all-food-entries`)
  }

  getDayEntries(date: string): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/get-food-entries/${date}`)
  }

  searchEntries(stringSearch: string): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/search-food-entries/${stringSearch}`)
  }


}
