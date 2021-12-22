import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";

const moment = _moment;

import {
  AdminService,
  AlertService,
  RegisterService,
} from "../../../../_services";
import { CPFCNPJChangeValidators } from "../../../../_validators";

@Component({
  selector: "app-bank-informations-forms",
  templateUrl: "./bank-informations-forms.component.html",
  styleUrls: ["./bank-informations-forms.component.scss"],
})
export class BankInformationsFormsComponent implements OnInit {
  dataBanckInformations: any = {};
  users: any;
  formId: string;

  profileForm: FormGroup;
  disabled = false;
  loadingSave = false;
  loadingResult = false;
  profile = null;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
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
      this.adminService.listUsers(0, 10000, "").subscribe(
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
    }
  }

  ngOnInit() {
    if (this.formId) {
      this.getById(this.formId);
      return;
    }
    this.buildForm();
  }

  cancel() {
    this.router.navigate(["/dados-bancarios"]);
  }

  getById(id: string = "") {
    this.loadingResult = true;
    this.registerService.getFormsByPathAndId("/bank", id).subscribe(
      (data) => {
        this.loadingResult = false;
        this.dataBanckInformations = data;
        this.buildForm();
      },
      ({ error }) => {
        this.loadingResult = false;
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
          10000,
          true
        );
        this.cancel();
      }
    );
  }

  hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  };

  buildForm() {
    this.profileForm = this.formBuilder.group(
      {
        user_id: [this.dataBanckInformations.user_id || this.profile.id],
        for_commissions: [this.dataBanckInformations.for_commissions ? 1 : 0],
        account_name: [this.dataBanckInformations.account_name || ""],
        bank_account_type: [
          this.dataBanckInformations.bank_account_type || "CONTA_CORRENTE",
        ],
        owner_name: [this.dataBanckInformations.owner_name || ""],
        owner_birth_date: [this.dataBanckInformations.owner_birth_date || ""],
        registry_code: [this.dataBanckInformations.registry_code || ""],
        bank_code: [this.dataBanckInformations.bank_code || ""],
        agency: [this.dataBanckInformations.agency || ""],
        account: [this.dataBanckInformations.account || ""],
        account_digit: [this.dataBanckInformations.account_digit || ""],
      },
      {
        // Here we create validators to be used for the group as a whole
        validator: Validators.compose([
          CPFCNPJChangeValidators.validateCPF,
          CPFCNPJChangeValidators.validateCNPJ,
        ]),
      }
    );
  }

  save() {
    if (this.profileForm.invalid) return;

    let data = { ...this.profileForm.value };

    //A api espera que os campos não preenchidos não sejam enviados.
    if (!data.for_commissions) delete data.for_commissions;
    if (!data.account_name) delete data.account_name;
    if (!data.bank_account_type) delete data.bank_account_type;
    if (!data.owner_name) delete data.owner_name;
    if (!data.owner_birth_date) delete data.owner_birth_date;
    if (!data.registry_code) delete data.registry_code;
    if (!data.bank_code) delete data.bank_code;
    if (!data.agency) delete data.agency;
    if (!data.account) delete data.account;
    if (!data.account_digit) delete data.account_digit;

    this.saveRegistrationForm(data);
  }

  saveRegistrationForm(data) {
    this.loadingSave = true;

    data.id = this.dataBanckInformations.id;
    data.owner_birth_date = moment(data.owner_birth_date).format("YYYY/MM/DD");

    this.registerService
      .saveBanckInformationForm(this.dataBanckInformations.id, data)
      .subscribe(
        (data: any) => {
          this.dataBanckInformations.id = data.id;
          this.loadingSave = false;
          this.alertService.success("Dados salvos com sucesso!");
        },
        ({ error }) => {
          this.loadingSave = false;
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
