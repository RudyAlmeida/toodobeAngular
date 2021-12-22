import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth-layout",
  templateUrl: "./auth-layout.component.html",
  styleUrls: ["./auth-layout.component.scss"],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  isRegisterPage = false;

  public isCollapsed = true;

  constructor(private router: Router) {
    this.isRegisterPage = this.router.url.includes('/cadastro');
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      this.isRegisterPage = this.router.url.includes('/cadastro');
    });
  }

  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }
}
