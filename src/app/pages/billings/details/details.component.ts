import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

import { AlertService, BillingsService } from "../../../_services";

import * as _moment from "moment";

const moment = _moment;

@Component({
  selector: "app-billing-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class BillingsDetailsComponent implements OnInit {
  loading = false;
  dataForm: any = {};
  formId = null;
  profile = null;

  @ViewChild("fileInput") fileInput;

  constructor(
    private alertService: AlertService,
    private billingsService: BillingsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    const userData = localStorage.getItem("userData");

    const {
      user: { profile },
    } = JSON.parse(userData);

    this.profile = profile;

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.formId = params.id;
      } else {
        this.cancel();
      }
    });
  }

  getById(id: string = "") {
    this.loading = true;
    this.billingsService.get(id).subscribe(
      (data) => {
        this.loading = false;
        data.due_date = moment(data.due_date).format("DD/MM/YYYY");
        data.value = data.value.replace(".", ",");
        this.dataForm = data;
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
          } catch {}
        }
        this.alertService.error(
          message ||
            "Ops!!! algo deu errado, por favor tente novamente mais tarde."
        );
        this.cancel();
      }
    );
  }

  ngOnInit() {
    if (this.formId) {
      this.getById(this.formId);
      return;
    }
  }

  cancel() {
    this.location.back();
  }
}
