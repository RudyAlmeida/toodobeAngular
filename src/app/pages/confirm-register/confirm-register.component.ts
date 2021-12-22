import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";

import { AlertService, AuthenticationService } from "../../_services";

@Component({
  selector: "app-confirm-register",
  templateUrl: "./confirm-register.component.html",
  styleUrls: ["./confirm-register.component.scss"],
})
export class ConfirmRegisterComponent implements OnInit {
  validatingToken = true;
  token = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
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

  ngOnInit() {
    this.authenticationService
      .validateRegisterToken(this.token)
      .pipe(first())
      .subscribe(
        (data) => {
          this.validatingToken = false;
          this.alertService.success(
            data?.message || "Cadastro confirmado com sucesso.",
            5000,
            true
          );
          this.router.navigate(["/login"]);
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
        }
      );
  }

  back() {
    this.router.navigate(["/login"]);
  }
}
