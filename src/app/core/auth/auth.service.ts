import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environments/environment"
import {Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";
import firebase from "firebase/compat";
import { User } from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null; //Firebase
  private tokenKey = 'access_token';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private http: HttpClient, private auth: Auth) {
    //Firebase
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.loggedIn$.next(!!user);
    });
  }

  //Rest API call
  // login(credentials: any): Observable<any> {
  //   return this.http.post<{token: string}>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
  //     tap((res: any) => this.setToken(res.token))
  //   )
  // }

  //Normal logout
  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  //   this.loggedIn$.next(false);
  // }

  //Firebase call
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }
  //Firebase logout
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.loggedIn$.next(false);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn$.next(true);
  }

  //Normal get token
  // getToken(): string | null {
  //   return localStorage.getItem(this.tokenKey);
  // }

  //Firebase get token
  getIdToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() || Promise.resolve(null);
  }
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
//Firebase
  getUser(): User | null {
    return this.currentUser;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
