import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import {
  AlertService,
  AuthenticationService,
  DashboardService,
} from "../../_services";

import { Profile } from "../../_models";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public profile: Profile;
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService,
    private alertService: AlertService
  ) {
    this.location = location;
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

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var i = 0; i < this.listTitles.length; i++) {
      const item = this.listTitles[i];
      if (item.path === titlee) {
        return item.description || item.title;
      }
    }
    return "Dashboard";
  }

  logout() {
    this.authenticationService.logout();
  }
}
