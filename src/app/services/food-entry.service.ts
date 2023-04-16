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

  public get userValue() {
    return this.userSubject.value;
  }

  saveEntry(foodEntry: string, foodEntryDate: string | null) {
    return this.http.post <FoodEntry>(`${environment.apiUrl}/food-entry/save-food-entry`, {foodEntry, foodEntryDate})
  }

  getAllEntries(): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/get-all-food-entries`)
  }
}
