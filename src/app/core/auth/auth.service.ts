import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post<{token: string}>('/api/auth/login', credentials).pipe(
      tap((res: any) => this.setToken(res.token))
    )
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn$.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
