import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, DashboardService, InviteService } from "../../_services";

import { Profile, Network } from "../../_models";

import * as _moment from "moment";

const moment = _moment;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  inviteForm: FormGroup;
  loading = false;
  profile: Profile;
  network: Network;

  @ViewChild(FormGroupDirective) private formDirective: FormGroupDirective;

  constructor(
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private inviteService: InviteService,
    private formBuilder: FormBuilder
  ) {
    const userData = localStorage.getItem("userData");

    if (!userData || userData === "undefined") {
      this.dashboardService
        .dashboard()
        .pipe(first())
        .subscribe(
          (data) => {
            const { profile, network } = data.user;
            this.profile = profile;
            this.profile.age = profile.birthday
              ? moment().diff(profile.birthday, "years")
              : 0;

            this.network = network;
            localStorage.setItem("userData", JSON.stringify(data));
          },
          ({ error }) => {
            this.alertService.error(
              error?.error ||
              "Ops!!! algo deu errado, por favor tente novamente mais tarde."
            );
          }
        );
    } else {
      const { profile, network } = JSON.parse(userData).user;
      this.profile = profile;
      this.profile.age = profile.birthday
        ? moment().diff(profile.birthday, "years")
        : 0;
      this.network = network;
    }
  }

  buildForm() {
    this.inviteForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      mobile: ["", [Validators.required]],
      name: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  sendInvite() {
    let data = { ...this.inviteForm.value, user_id: this.profile.id };
    this.loading = true;
    this.inviteService.create(data).subscribe(
      (data) => {
        this.loading = false;
        this.formDirective.resetForm()
        this.alertService.success("Enviado com sucesso", 7000);
      },
      ({ error }) => {
        this.loading = false;
        let message = "";
        if (typeof error?.error === "string") {
          message = error?.error;
        } else if (error?.error) {
          try {
            Object.values(error?.error).forEach(
              (item, i) => (message += `${i === 0 ? "" : " ,"}${item}`)
            );
          } catch { }
        }
        this.alertService.error(
          message ||
          "Ops!!! algo deu errado, por favor tente novamente mais tarde."
        );
      }
    );
  }

  hasError = (controlName: string, errorName: string) => {
    return this.inviteForm.controls[controlName].hasError(errorName);
  };
}
