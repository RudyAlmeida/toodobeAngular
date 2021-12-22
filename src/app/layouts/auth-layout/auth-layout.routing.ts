import { Routes } from "@angular/router";

import { ForgotPasswordComponent } from "../../pages/forgot-password/forgot-password.component";
import { LoginComponent } from "../../pages/login/login.component";
import { RegisterComponent } from "../../pages/register/register.component";
import { ChangePasswordComponent } from "../../pages/change-password/change-password.component";
import { ConfirmRegisterComponent } from "../../pages/confirm-register/confirm-register.component";

export const AuthLayoutRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: RegisterComponent },
  { path: "esqueci-senha", component: ForgotPasswordComponent },
  { path: "alterar-senha", component: ChangePasswordComponent },
  { path: "validar-cadastro", component: ConfirmRegisterComponent },
];
