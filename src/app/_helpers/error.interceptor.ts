import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import Bugsnag from "@bugsnag/js";

import { AuthenticationService } from "../_services";

// configure Bugsnag asap
Bugsnag.start({ apiKey: "8871c3370634d390aaf451d2a530e6bb" });

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          !(
            err.url.includes("/logout") ||
            err.url.includes("/login") ||
            err.url.includes("/invite/create") ||
            err.url.includes("/dashboard")
          )
        ) {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            // location.reload(true);
          }
        }

        if (err.status !== 401) {
          Bugsnag.notify(err);
        }

        // const error = err.error.message || err.statusText;
        return throwError(err);
      })
    );
  }
}
