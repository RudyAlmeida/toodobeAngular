import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";

const moment = _moment;

import { AlertService, DashboardService, UserService } from "../../_services";
import { CPFCNPJChangeValidators, PWChangeValidators } from "../../_validators";
import { Profile } from "../../_models";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: Profile;
  disabled = false;
  loading = false;
  invalidTypeFile = false;

  @ViewChild("fileInput") fileInput;
  @ViewChild("mobile") mobile;

  constructor(
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    const userData = localStorage.getItem("userData");

    if (!userData || userData === "undefined") {
      this.dashboardService.dashboard().subscribe(
        (data) => {
          this.profile = data.user.profile;
          localStorage.setItem("userData", JSON.stringify(data));
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
        }
      );
    } else {
      this.profile = JSON.parse(userData).user.profile;
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  };

  buildForm() {
    this.profileForm = this.formBuilder.group(
      {
        //personal_references
        email: [
          { value: this.profile.email, disabled: this.disabled },
          [Validators.required, Validators.email],
        ],
        mobile: [
          { value: this.profile.mobile || "", disabled: this.disabled },
          [Validators.required],
        ],
        name: [
          { value: this.profile.name, disabled: this.disabled },
          [Validators.required],
        ],
        registry_code: [
          { value: this.profile.registry_code, disabled: this.disabled },
          [Validators.required],
        ],
        birthday: [this.profile.birthday],
        password: [{ value: "", disabled: this.disabled }],
        confirm: [{ value: "", disabled: this.disabled }],
        address_city: [this.profile.address_city],
        address_state: [this.profile.address_state],
        address_country: [this.profile.address_country],
        user_image: [""],
      },
      {
        // Here we create validators to be used for the group as a whole
        validator: Validators.compose([
          CPFCNPJChangeValidators.validateCPF,
          PWChangeValidators.newMatchesConfirm,
        ]),
      }
    );
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.invalidTypeFile = false;
      if (!event.target.files[0].type.startsWith("image/")) {
        this.invalidTypeFile = true;
        this.fileInput.nativeElement.value = null;
        return;
      }

      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.profile.photo = event.target.result;
      };
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  save() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    let data = { ...this.profileForm.value };

    data.birthday = moment(data.birthday).format("YYYY/MM/DD");
    data.password_confirmation = data.confirm;
    data.mobile = this.mobile.nativeElement.value;

    const fi = this.fileInput.nativeElement;

    if (fi.files && fi.files[0]) {
      data.user_image = fi.files[0];
    }

    this.userService.register(data).subscribe(
      (data) => {
        this.loading = false;
        this.alertService.success("Dados salvos com sucesso!");

        const userData = JSON.parse(localStorage.getItem("userData"));
        userData.user.profile = data;
        localStorage.setItem("userData", JSON.stringify(userData));
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
