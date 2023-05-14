import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User, UserRegister} from "../model";
import {environment} from "../../environments/environemnt";


@Injectable({providedIn: 'root'})
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

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

  login(email: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}/auth/authenticate`, {email, password})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    return this.http.post<User>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(map(user => {
        this.userSubject.next(user);
        return user;
      }));
  }

  register(user: UserRegister) {
    return this.http.post(`${environment.apiUrl}/auth/register`, user);
  }
}
