import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertService, SubscriptionsService } from "../../../_services";

import { columns } from "./const-data";

import * as _moment from "moment";

const moment = _moment;

@Component({
  selector: "app-subscriptions-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class SubscriptionsDetailsComponent implements OnInit {
  loading = false;
  dataForm: any = {};
  formId = null;
  profile = null;
  dataTableInfo = columns;
  displayedColumns: string[];

  @ViewChild("fileInput") fileInput;

  constructor(
    private alertService: AlertService,
    private subscriptionsService: SubscriptionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.displayedColumns = this.dataTableInfo.headers;

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
    this.subscriptionsService.get(id).subscribe(
      (data) => {
        this.loading = false;
        data.next_due_date = moment(data.next_due_date).format("DD/MM/YYYY");
        data.value = data.value.replace(".", ",");

        if (data.billings) {
          data.billings.forEach((item: any) => {
            item.value = item.value.replace(".", ",");
            item.due_date = moment(item.due_date).format("DD/MM/YYYY");
          });
        }

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
            "Ops!!! algo deu errado, por favor tente novamente mais tarde.",
          13000,
          true
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

  sendToView(id: string) {
    this.router.navigate([`/detalhes-cobranca/${id}`]);
  }

  cancel() {
    this.router.navigate(["/assinaturas"]);
  }
}
