import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

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
  ZipcodeService,
} from "../../../../_services";

import {
  CPFCNPJChangeValidators,
  PisPasepValidators,
} from "../../../../_validators";

import {
  addressTypes,
  educationLevel,
  formTypes,
  maritalStatus,
  vehicleType,
} from "./const-data";

@Component({
  selector: "app-registration-forms",
  templateUrl: "./registration-forms.component.html",
  styleUrls: ["./registration-forms.component.scss"],
})
export class RegistrationFormsComponent implements OnInit {
  @ViewChild("address_type_other_string") addressTypeOther: ElementRef;
  @ViewChild("marital_status_other_string") maritalStatusOther: ElementRef;

  loadingSave: boolean;
  dataForm: any = {};
  users: any;
  formId: string;

  profileForm: FormGroup;
  disabled = false;
  loadingResult = false;
  validatingZipCode = false;
  addressTypes = addressTypes;
  formTypes = formTypes;
  maritalStatus = maritalStatus;
  educationLevel = educationLevel;
  vehicleTypes = vehicleType;
  profile = null;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private route: ActivatedRoute,
    private router: Router,
    private zipcodeService: ZipcodeService
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
    this.router.navigate(["/fichas-cadastrais"]);
  }

  getById(id: string = "") {
    this.loadingResult = true;
    this.registerService
      .getFormsByPathAndId("/registration-form", id)
      .subscribe(
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

  hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  };

  buildForm() {
    this.profileForm = this.formBuilder.group(
      {
        //personal_references
        name: [
          {
            value: this.dataForm.name || "",
            disabled: this.disabled,
          },
          [Validators.required],
        ],
        registration_form_type: [
          this.dataForm.registration_form_type || "principal",
        ],
        //Address
        address_zipcode: [this.dataForm.address_zipcode || ""],
        address_type: [this.dataForm.address_type || "propria"],
        address_type_other_string: [
          this.dataForm.address_type_other_string || "",
        ],
        address_street: [this.dataForm.address_street || ""],
        address_number: [this.dataForm.address_number || ""],
        address_complement: [this.dataForm.address_complement || ""],
        address_neighborhood: [this.dataForm.address_neighborhood || ""],
        address_city: [
          { value: this.dataForm.address_city || "", disabled: false },
        ],
        address_state: [
          { value: this.dataForm.address_state || "", disabled: false },
        ],
        address_dwelling_time: [this.dataForm.address_dwelling_time || ""],

        phone: [this.dataForm.phone || ""],
        marital_status: [this.dataForm.marital_status || ""],
        marital_status_other_string: [
          this.dataForm.marital_status_other_string || "",
        ],
        birthday: [this.dataForm.birthday || ""],
        citizenship: [this.dataForm.citizenship || ""],
        hometown: [this.dataForm.hometown || ""],
        mothers_name: [this.dataForm.mothers_name || ""],
        fathers_name: [this.dataForm.fathers_name || ""],
        professional_category: [this.dataForm.professional_category || ""],
        profession: [this.dataForm.profession || ""],
        proven_income: [this.dataForm?.proven_income?.replace(".", ",") || ""],
        pis: [this.dataForm.pis || ""],
        fgts_value: [this.dataForm?.fgts_value?.replace(".", ",") || ""],
        employed: [this.dataForm.employed || false],
        company_name: [this.dataForm.company_name || ""],
        company_admission_date: [this.dataForm.company_admission_date || ""],
        declaring_ir: [this.dataForm.declaring_ir || false],
        education_level: [this.dataForm.education_level || ""],
        educational_institution: [this.dataForm.educational_institution || ""],
        course: [this.dataForm.course || ""],
        conclusion_year: [
          this.dataForm.conclusion_year
            ? moment(`${this.dataForm.conclusion_year}-01-01T00:00:00.000`)
            : "",
        ],
        has_vehicle: [this.dataForm.has_vehicle || false],
        vehicle_type_other_string: [
          this.dataForm.vehicle_type_other_string || "",
        ],
        vehicle_type: [this.dataForm.vehicle_type || ""],
        vehicle_manufacturer: [this.dataForm.vehicle_manufacturer || ""],
        vehicle_model: [this.dataForm.vehicle_model || ""],
        vehicle_year: [
          this.dataForm.vehicle_year
            ? moment(`${this.dataForm.vehicle_year}-01-01T00:00:00.000`)
            : "",
        ],
        own_property: [this.dataForm.own_property || false],
        property_value: [
          this.dataForm?.property_value?.replace(".", ",") || "",
        ],
        businessman: [this.dataForm.businessman || false],
        businessman_name: [this.dataForm.businessman_name || ""],
        businessman_cnpj: [this.dataForm.businessman_cnpj || ""],
        approximate_billing: [
          this.dataForm?.approximate_billing?.replace(".", ",") || "",
        ],
        height: [this.dataForm.height || ""],
        weight: [this.dataForm.weight || ""],
        user_id: [this.dataForm.user_id || this.profile.id],
      },
      {
        // Here we create validators to be used for the group as a whole
        validator: Validators.compose([
          PisPasepValidators.validatePisPasep,
          CPFCNPJChangeValidators.validateCNPJ,
        ]),
      }
    );
  }

  setOther() {
    if (this.profileForm.value.address_type !== "outro") {
      this.profileForm.patchValue({
        address_type: "outro",
      });
    }
  }

  changedAddressType(ev) {
    if (ev.value === "outro") {
      this.addressTypeOther.nativeElement.focus();
    }
  }

  changedMaritalStatus(ev) {
    if (ev.target.value === "outro") {
      setTimeout(() => {
        this.maritalStatusOther.nativeElement.focus();
      }, 100);
    }
  }

  chosenYearHandler(normalizedYear: any, datepicker: any, field: string) {
    this.profileForm.patchValue({
      [field]: normalizedYear,
    });
    datepicker.close();
  }

  zipcodeChange(input) {
    const { value } = input.target;
    if (value.length !== 9) return;
    this.validatingZipCode = true;
    this.zipcodeService
      .checkZipCode(value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.validatingZipCode = false;
          if (data.erro) {
            this.alertService.error("Ops!!! não encontramos o CEP informado.");
            this.profileForm.controls["address_zipcode"].setErrors({
              zipcode: true,
            });
          }
          this.profileForm.patchValue({
            address_city: data.localidade,
            address_state: data.uf,
            address_neighborhood: data.bairro,
            address_street: data.logradouro,
          });
        },
        () => {
          this.validatingZipCode = false;
        }
      );
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid");
    this.scrollTo(firstElementWithError);
  }

  save() {
    if (this.profileForm.invalid) {
      this.scrollToError();
      return;
    }

    let data = { ...this.profileForm.value };

    //A api espera que os campos não preenchidos não sejam enviados.
    if (!data.birthday) delete data.birthday;
    if (!data.address_city) delete data.address_city;
    if (!data.address_state) delete data.address_state;
    if (!data.address_zipcode) delete data.address_zipcode;
    if (!data.address_street) delete data.address_street;
    if (!data.address_number) delete data.address_number;
    if (!data.address_complement) delete data.address_complement;
    if (!data.address_neighborhood) delete data.address_neighborhood;
    if (!data.address_dwelling_time) delete data.address_dwelling_time;
    if (!data.address_type_other_string) delete data.address_type_other_string;
    if (!data.phone) delete data.phone;
    if (!data.marital_status) delete data.marital_status;
    if (!data.citizenship) delete data.citizenship;
    if (!data.hometown) delete data.hometown;
    if (!data.marital_status_other_string)
      delete data.marital_status_other_string;
    if (!data.mothers_name) delete data.mothers_name;
    if (!data.fathers_name) delete data.fathers_name;
    if (!data.professional_category) delete data.professional_category;
    if (!data.profession) delete data.profession;
    if (!data.proven_income) delete data.proven_income;
    if (!data.pis) delete data.pis;
    if (!data.fgts_value) delete data.fgts_value;
    if (!data.company_name) delete data.company_name;
    if (!data.company_admission_date) delete data.company_admission_date;
    if (!data.education_level) delete data.education_level;
    if (!data.educational_institution) delete data.educational_institution;
    if (!data.course) delete data.course;
    if (!data.conclusion_year) delete data.conclusion_year;
    if (!data.vehicle_type_other_string) delete data.vehicle_type_other_string;
    if (!data.vehicle_type) delete data.vehicle_type;
    if (!data.vehicle_manufacturer) delete data.vehicle_manufacturer;
    if (!data.vehicle_model) delete data.vehicle_model;
    if (!data.vehicle_year) delete data.vehicle_year;
    if (!data.property_value) delete data.property_value;
    if (!data.businessman_name) delete data.businessman_name;
    if (!data.businessman_cnpj) delete data.businessman_cnpj;
    if (!data.approximate_billing) delete data.approximate_billing;
    if (!data.height) delete data.height;
    if (!data.weight) delete data.weight;

    if (data.proven_income) {
      data.proven_income = data.proven_income.replace(/\./g, "");
      data.proven_income = data.proven_income.replace(",", ".");
    }

    if (data.fgts_value) {
      data.fgts_value = data.fgts_value.replace(/\./g, "");
      data.fgts_value = data.fgts_value.replace(",", ".");
    }

    if (data.property_value) {
      data.property_value = data.property_value.replace(/\./g, "");
      data.property_value = data.property_value.replace(",", ".");
    }

    if (data.approximate_billing) {
      data.approximate_billing = data.approximate_billing.replace(/\./g, "");
      data.approximate_billing = data.approximate_billing.replace(",", ".");
    }

    this.saveRegistrationForm(data);
  }

  saveRegistrationForm(data) {
    this.loadingSave = true;

    data.id = this.dataForm.id;

    if (data.conclusion_year) {
      data.conclusion_year = moment(data.conclusion_year).year();
    }
    if (data.vehicle_year) {
      data.vehicle_year = moment(data.vehicle_year).year();
    }
    if (data.birthday) {
      data.birthday = moment(data.birthday).format("YYYY/MM/DD");
    }
    if (data.company_admission_date) {
      data.company_admission_date = moment(data.company_admission_date).format(
        "YYYY/MM/DD"
      );
    }

    this.registerService.saveRegistrationForm(this.dataForm.id, data).subscribe(
      (data: any) => {
        this.dataForm.id = data.id;
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
