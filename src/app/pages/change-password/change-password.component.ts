import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, AuthenticationService } from "../../_services";
import { PWChangeValidators } from "../../_validators";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changeForm: FormGroup;
  loading = false;
  validatingToken = false;
  submitted = false;
  hide = true;
  token;
  invalidToken = false;

  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }

    this.token = this.route.snapshot.queryParams["token"];

    if (!this.token) {
      this.router.navigate(["/login"]);
    }
  }

  buildForm() {
    this.changeForm = this.formBuilder.group(
      {
        email: [
          { value: "", disabled: this.invalidToken },
          [Validators.required, Validators.email],
        ],
        password: [
          { value: "", disabled: this.invalidToken },
          [Validators.required],
        ],
        confirm: [
          { value: "", disabled: this.invalidToken },
          Validators.required,
        ],
      },
      {
        // Here we create validators to be used for the group as a whole
        validator: Validators.compose([PWChangeValidators.newMatchesConfirm]),
      }
    );
  }

  ngOnInit() {
    this.buildForm();
    this.validatingToken = true;
    this.authenticationService
      .validateResetToken(this.token)
      .pipe(first())
      .subscribe(
        (data) => {
          this.validatingToken = false;
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
          this.validatingToken = false;
          this.invalidToken = true;
          this.buildForm();
        }
      );
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  hasError = (controlName: string, errorName: string) => {
    return this.changeForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    // stop here if form is invalid
    if (this.changeForm.invalid || this.invalidToken) {
      return;
    }

    const { value } = this.changeForm;

    this.loading = true;
    this.authenticationService
      .passwordReset(value.email, value.password, value.confirm, this.token)
      .pipe(first())
      .subscribe(
        (data) => {
          this.submitted = true;
          this.loading = false;
          this.alertService.success(
            "Senha atualizada com sucesso, te enviaremos pro login em instantes."
          );
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 3000);
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
