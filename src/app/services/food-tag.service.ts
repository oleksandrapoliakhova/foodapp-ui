import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FoodEntryResponse, FoodTag, User} from "../model";
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

  saveTag(foodTagName: string | undefined, foodTagColor: string | undefined) {
    console.log("saving tag", foodTagName, foodTagColor);
    return this.http.post <FoodTag>(`${environment.apiUrl}/food-tag/save-food-tag`, {foodTagName, foodTagColor})
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete <FoodTag>(`${environment.apiUrl}/food-tag/delete-food-tag/${id}`, {})
  }

  deleteFoodTagIdFromEntry(entryId: number): Observable<any> {
    // /delete-food-tag/{foodEntryId}/food-tags
    console.log(`${environment.apiUrl}/delete-food-tag/${entryId.toString()}/food-tags`);
    return this.http.delete <any>(`${environment.apiUrl}/food-tag/delete-food-tag/${entryId.toString()}/food-tags`, {})
  }

  getAllTags(): Observable<any> {
    return this.http.get <FoodTag>(`${environment.apiUrl}/food-tag/get-all-food-tags`)
  }

  appendTag(foodEntryId: any, foodTagId: any) {
    let id = foodEntryId.toString();
    let id2 = foodTagId.toString();
    console.log("appending tag", id, id2);
    console.log(`${environment.apiUrl}/food-tag/append-food-tag/${id}/food-tags/${id2}`);
    return this.http.post <FoodEntryResponse>(`${environment.apiUrl}/food-tag/append-food-tag/${id}/food-tags/${id2}`, {})
  }

  searchTags(stringSearch: string): Observable<any> {
    return this.http.get <FoodEntryResponse>(`${environment.apiUrl}/food-entry/search-food-tags/${stringSearch}`)
  }
}
