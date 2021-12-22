import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, AuthenticationService } from "../../_services";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  hasError = (controlName: string, errorName: string) => {
    return this.forgotForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .forgotPassword(this.forgotForm.controls.email.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.submitted = true;
          this.loading = false;
          this.alertService.success(
            "Enviamos um email com os dados pra você recuperar sua senha, não esqueça de verificar nos spams também :)",
            15000
          );
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
          this.loading = false;
        }
      );
  }
}
