import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Register, User } from "../_models";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    let user = sessionStorage.getItem("currentUser");
    if (!user || user === "undefined") {
      user = localStorage.getItem("currentUser");
    }
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, persist: boolean) {
    return this.http
      .post<any>(`${environment.apiUrl}/login`, { email, password })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.access_token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (persist) {
              localStorage.setItem("currentUser", JSON.stringify(user));
            } else {
              sessionStorage.setItem("currentUser", JSON.stringify(user));
            }
            this.currentUserSubject.next(user);
          } else if (user && !user.success) {
          }

          return user;
        })
      );
  }

  forgotPassword(email: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/password-reset/create`, { email })
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  passwordReset(
    email: string,
    password: string,
    confirm: string,
    token: string
  ) {
    return this.http
      .post<any>(`${environment.apiUrl}/password-reset/reset`, {
        email,
        password,
        password_confirmation: confirm,
        token,
      })
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  register(register) {
    return this.http.post<any>(`${environment.apiUrl}/register`, register).pipe(
      map((user) => {
        return user;
      })
    );
  }

  getPropertiesList() {
    return this.http.get<any[]>(`${environment.apiUrl}/properties/list`);
  }

  validateResetToken(token: string) {
    return this.http
      .get<any>(`${environment.apiUrl}/password-reset/find/${token}`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  validateRegisterToken(token: string) {
    return this.http
      .get<any>(`${environment.apiUrl}/verify-email/${token}`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  resendVerificationEmail(email: string) {
    return this.http
      .get<any>(`${environment.apiUrl}/resend-verification-email/${email}`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  clearToken() {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.plurall.net`;
    });
  }

  logout() {
    this.http.post<any>(`${environment.apiUrl}/logout`, {}).subscribe();
    // remove user from local storage to log user out
    sessionStorage.clear();
    localStorage.clear();
    this.clearToken();
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }
}
