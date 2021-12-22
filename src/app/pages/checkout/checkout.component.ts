import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AlertService } from "../../_services";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  chackoutForm: FormGroup;
  loading = false;
  paymentMethod = "credit_card";
  selectedFlag = '';


  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.chackoutForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      card_number: ["", [Validators.required]],
    });
  }

  setPaymentMethod(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.chackoutForm.controls[controlName].hasError(errorName);
  };
}
