import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, ErrorHandler } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { RegistersLayoutComponent } from "./layouts/registers-layout/registers-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import Bugsnag from "@bugsnag/js";
import { BugsnagErrorHandler } from "@bugsnag/plugin-angular";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";

import { MaterialModule } from "./material.module";

import { FlexLayoutModule } from "@angular/flex-layout";
import { JwtInterceptor, ErrorInterceptor } from "./_helpers";

// configure Bugsnag asap
Bugsnag.start({ apiKey: "8871c3370634d390aaf451d2a530e6bb" });

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler();
}

Bugsnag.notify(new Error("Test error"));

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    RegistersLayoutComponent,
  ],
  providers: [
    /* Pass the BugsnagErrorHandler class along to the providers for your module */
    { provide: ErrorHandler, useFactory: errorHandlerFactory },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
