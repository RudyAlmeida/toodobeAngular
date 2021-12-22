import { Component, Inject, OnInit, NgModule } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { MatButtonModule } from "@angular/material/button";

import {
  AlertService,
  AuthenticationService,
  DashboardService,
} from "../../_services";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      persist: [false],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const {
      value: { email, password, persist },
    } = this.loginForm;

    this.loading = true;
    this.authenticationService
      .login(email, password, persist)
      .pipe(first())
      .subscribe(
        (data) => {
          this.dashboardService
            .dashboard()
            .pipe(first())
            .subscribe(
              (userData) => {
                localStorage.setItem("userData", JSON.stringify(userData));
                this.router.navigate([this.returnUrl]);
              },
              (error) => {
                this.loading = false;
                this.authenticationService.logout();
                if (error.status === 401 || error.status === 400) {
                  this.dialog.open(DialogResendVerificationEmail, {
                    width: "450px",
                    data: { email: this.loginForm.value.email },
                  });
                } else {
                  this.alertService.error(
                    error?.error?.error ||
                      "Ops!!! algo deu errado, por favor tente novamente mais tarde."
                  );
                }
              }
            );
        },
        (error) => {
          this.alertService.error(
            error.status === 401
              ? "Email ou senha incorreto."
              : "Ops!!! Algo deu errado, por favor tente novamente mais tarde."
          );
          this.loading = false;
        }
      );
  }
}

export interface DialogData {
  email: string;
}

@Component({
  selector: "resend-verification-email",
  templateUrl: "./resend-verification-email.html",
  styleUrls: ["./resend-verification-email.scss"],
})
export class DialogResendVerificationEmail {
  constructor(
    public dialogRef: MatDialogRef<DialogResendVerificationEmail>,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onYesClick(): void {
    this.authenticationService
      .resendVerificationEmail(this.data.email)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success(data.message);
          this.dialogRef.close();
        },
        ({ error }) => {
          let message = "";
          if (typeof error?.error === "string") {
            message = error?.error;
          } else if (error?.error) {
            try {
              Object.values(error?.error).forEach(
                (item, i) => (message += `${i === 0 ? "" : " ,"}${item}`)
              );
            } catch {}
          }
          this.alertService.error(
            message ||
              "Ops!!! algo deu errado, por favor tente novamente mais tarde."
          );
          this.dialogRef.close();
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
