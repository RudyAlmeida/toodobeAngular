import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import {
  AdminService,
  AlertService,
  SubscriptionsService,
} from "../../../_services";
import { Subscriptions } from "../../../_models";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";

const moment = _moment;

@Component({
  selector: "app-subscriptions-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class SubscriptionsRegisterComponent implements OnInit {
  documentForm: FormGroup;
  disabled = false;
  loading = false;
  loadingResult = false;
  dataForm: any = {};
  formId = null;
  profile = null;
  users: any;
  invalidTypeFile = false;

  constructor(
    private alertService: AlertService,
    private adminService: AdminService,
    private subscriptionsService: SubscriptionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const userData = localStorage.getItem("userData");

    const {
      user: { profile },
    } = JSON.parse(userData);

    this.profile = profile;

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.formId = params.id;
      }
    });

    if (profile.role === "admin") {
      this.adminService.listUsers(0, 100000, "").subscribe(
        ({ data }) => {
          this.users = data;
        },
        (error) => {
          if (error.status === 403) {
            this.users = [];
          } else {
            const { error: erro } = error;
            this.alertService.error(
              erro?.error ||
                "Ops!!! algo deu errado, por favor tente novamente mais tarde.",
              7000,
              true
            );
          }
        }
      );
    } else {
      this.cancel();
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.documentForm.controls[controlName].hasError(errorName);
  };

  buildForm() {
    this.documentForm = this.formBuilder.group({
      id: [this.dataForm.id || "", [Validators.required]],
      user_id: [
        { value: this.dataForm.user_id || "", disabled: this.disabled },
        [Validators.required],
      ],
      description: [
        { value: this.dataForm.description || "", disabled: this.disabled },
        [Validators.required],
      ],
      value: [
        {
          value: this.dataForm.value?.replace(".", ",") || "",
          disabled: this.disabled,
        },
        [Validators.required],
      ],
      billing_type: [
        {
          value: this.dataForm.billing_type || "UNDEFINED",
          disabled: this.disabled,
        },
        [Validators.required],
      ],
      next_due_date: [
        { value: this.dataForm.next_due_date || "", disabled: this.disabled },
        [Validators.required],
      ],
    });
  }

  getById(id: string = "") {
    this.loadingResult = true;
    this.subscriptionsService.get(id).subscribe(
      (data) => {
        this.loadingResult = false;
        this.dataForm = data;
        this.buildForm();
      },
      ({ error }) => {
        this.loadingResult = false;
        this.alertService.error(
          error?.error ||
            "Ops!!! algo deu errado, por favor tente novamente mais tarde.",
          10000,
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
    this.buildForm();
  }

  cancel() {
    this.router.navigate(["/assinaturas"]);
  }

  onSubmit() {
    if (this.loading || (!this.formId && this.profile.role !== "admin")) {
      return;
    }

    this.loading = true;

    let data: Subscriptions = { ...this.documentForm.value };

    data.next_due_date = moment(data.next_due_date).format("YYYY/MM/DD");

    if (data.value) {
      data.value = data.value.replace(/\./g, "");
      data.value = data.value.replace(",", ".");
    }

    this.subscriptionsService.save(this.formId, data).subscribe(
      (data) => {
        this.loading = false;
        this.alertService.success("Dados salvos com sucesso!", 8000, true);
        this.router.navigate(["/assinaturas"]);
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
      }
    );
  }
}
