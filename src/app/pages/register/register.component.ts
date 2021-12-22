import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { first } from "rxjs/operators";

import {
  AlertService,
  AuthenticationService,
  PropertiesService,
} from "../../_services";
import { CPFCNPJChangeValidators, PWChangeValidators } from "../../_validators";
import { Currency } from "../../_utils";

import * as _moment from "moment";

const moment = _moment;

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  addressForm: FormGroup;
  finalForm: FormGroup;
  loadingProperties = false;
  loading = false;
  submitted = false;
  hide = true;
  affiliateCode = "";
  affiliateTypes = [
    { value: "afiliado", text: "Afiliado" },
    { value: "influenciador", text: "Influenciador" },
  ];
  displayedColumns: string[] = [
    "id",
    "property_value",
    "first_installment",
    "last_installment",
  ];
  dataSource = [];

  @ViewChild("stepper") stepper: MatStepper;

  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }

    this.loadingProperties = true;

    this.propertiesService.getAll().subscribe(
      ({ data }) => {
        this.loadingProperties = false;
        data.forEach((item) => {
          item.property_value = `R$ ${Currency.toBrasilianFormat(
            item.property_value
          )}`;
          item.first_installment = `R$ ${Currency.toBrasilianFormat(
            item.first_installment
          )}`;
          item.last_installment = `R$ ${Currency.toBrasilianFormat(
            item.last_installment
          )}`;
        });

        this.dataSource = data;
      },
      ({ error }) => {
        let message = error?.error;
        this.alertService.error(
          message ||
            "Ops!!! algo deu errado, por favor tente novamente mais tarde."
        );
        this.loadingProperties = false;
      }
    );

    this.affiliateCode = this.route.snapshot.queryParams["affiliateCode"];
  }

  buildForm() {
    this.registerForm = this.formBuilder.group(
      {
        acceptTerms: [{ value: false, disabled: this.submitted }],
        affiliate_code: [
          { value: this.affiliateCode || "", disabled: this.submitted },
        ],
        confirm: [
          { value: "", disabled: this.submitted },
          [Validators.required],
        ],
        email: [
          { value: "", disabled: this.submitted },
          [Validators.required, Validators.email],
        ],
        mobile: [
          { value: "", disabled: this.submitted },
          [Validators.required],
        ],
        name: [{ value: "", disabled: this.submitted }, [Validators.required]],
        password: [
          { value: "", disabled: this.submitted },
          [Validators.required],
        ],
        registry_code: [
          { value: "", disabled: this.submitted },
          [Validators.required],
        ],
        birthday: [
          { value: "", disabled: this.submitted },
          [Validators.required],
        ],
      },
      {
        // Here we create validators to be used for the group as a whole
        validator: Validators.compose([
          PWChangeValidators.newMatchesConfirm,
          CPFCNPJChangeValidators.validateCPF,
        ]),
      }
    );
    this.addressForm = this.formBuilder.group({
      address_city: [
        { value: "", disabled: this.submitted },
        [Validators.required],
      ],
      address_state: [
        { value: "", disabled: this.submitted },
        [Validators.required],
      ],
      address_country: [
        { value: "", disabled: this.submitted },
        [Validators.required],
      ],
    });
    this.finalForm = this.formBuilder.group({
      affiliate_type: [
        { value: "afiliado", disabled: this.submitted },
        [Validators.required],
      ],
      property_values_id: [""],
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  };

  hasAddressError = (controlName: string, errorName: string) => {
    return this.addressForm.controls[controlName].hasError(errorName);
  };

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid");
    this.scrollTo(firstElementWithError);
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.registerForm.invalid || this.addressForm.invalid) {
      if (this.registerForm.invalid) {
        this.stepper.selectedIndex = 0;
      } else if (this.addressForm.invalid) {
        this.stepper.selectedIndex = 1;
      }
      setTimeout(() => {
        this.scrollToError();
      }, 200);
      return;
    }

    const data = {
      ...this.registerForm.value,
      ...this.addressForm.value,
      ...this.finalForm.value,
    };

    data.birthday = moment(data.birthday).format("YYYY/MM/DD");
    data.password_confirmation = data.confirm;

    delete data.confirm;

    if (data.affiliate_type !== "afiliado") {
      delete data.property_values_id;
    } else {
      if (!data.property_values_id) {
        this.alertService.error("Selecione uma linha da tabela.", 7000);
        return;
      }
    }

    this.loading = true;
    this.authenticationService
      .register(data)
      .pipe(first())
      .subscribe(
        (data) => {
          this.submitted = true;
          this.loading = false;
          this.alertService.success(data.message, 25000, true);
          this.cancel();
        },
        ({ error }) => {
          let message = "";
          if (typeof error?.error === "string") {
            message = error?.error;
          } else {
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
