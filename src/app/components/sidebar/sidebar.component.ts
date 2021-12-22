import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  AlertService,
  AuthenticationService,
  DashboardService,
} from "../../_services";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  description?: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "dashboard",
    class: "text-primary",
  },
  {
    path: "/perfil-usuario",
    title: "Perfil",
    description: "Ficha cadastral",
    icon: "account_circle",
    class: "text-yellow",
  },
  {
    path: "/documentos",
    title: "Documentos",
    icon: "file_copy",
    class: "text-red",
  },
  {
    path: "/assinaturas",
    title: "Assinaturas",
    icon: "payment",
    class: "text-primary",
  },
  {
    path: "/cobrancas",
    title: "cobranças",
    icon: "monetization_on",
    class: "text-red",
  },
  { path: "/rede", title: "Rede", icon: "account_tree", class: "text-pink" },
  {
    path: "/fichas-cadastrais",
    title: "Ficha cadastral",
    icon: "person_add",
    class: "text-yellow",
  },
  {
    path: "/bonus",
    title: "Bônus",
    icon: "monetization_on",
    class: "text-red",
  },
  {
    path: "/universidade",
    title: "Universidade",
    icon: "business",
    class: "text-pink",
  },
  {
    path: "/certificados",
    title: "Certificados",
    icon: "school",
    class: "text-primary",
  },
  {
    path: "/marketing",
    title: "Marketing",
    icon: "live_tv",
    class: "text-red",
  },
  { path: "/eventos", title: "Eventos", icon: "event", class: "text-pink" },
  { path: "/suporte", title: "Suporte", icon: "help", class: "text-primary" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public menuApi: any[];
  public isCollapsed = true;
  public profile: any = {};

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService,
    private alertService: AlertService
  ) {
    const userData = localStorage.getItem("userData");

    if (!userData || userData === "undefined") {
      this.dashboardService.dashboard().subscribe(
        (data) => {
          this.profile = data.user.profile;
          this.menuApi = data.user.menu;
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
      const {
        user: { profile, menu },
      } = JSON.parse(userData);

      this.profile = profile;
      this.menuApi = menu;
    }
  }

  ngOnInit() {
    // this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.menuItems = this.menuApi;
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logout() {
    this.authenticationService.logout();
  }
}
