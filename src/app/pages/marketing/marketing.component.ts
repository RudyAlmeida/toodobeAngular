import { Component, OnInit } from "@angular/core";

import { AlertService, MarketingService } from "../../_services";

@Component({
  selector: "app-marketing",
  templateUrl: "./marketing.component.html",
  styleUrls: ["./marketing.component.scss"],
})
export class MarketingComponent implements OnInit {
  marketings = [];
  loading = true;

  constructor(
    private alertService: AlertService,
    private marketingService: MarketingService
  ) {}

  ngOnInit() {
    this.marketingService.list().subscribe(
      ({ data }) => {
        this.marketings = data;
        this.loading = false;
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
