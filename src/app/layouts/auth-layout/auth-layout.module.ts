import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthLayoutRoutes } from "./auth-layout.routing";
import { NgxMaskModule, IConfig } from "ngx-mask";

import { MaterialModule } from "../../material.module";

import { LoginComponent, DialogResendVerificationEmail } from "../../pages/login/login.component";
import { RegisterComponent } from "../../pages/register/register.component";
import { ForgotPasswordComponent } from "../../pages/forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "../../pages/change-password/change-password.component";
import { PasswordStrengthComponent } from "../../pages/password-strength/password-strength.component";
import { ConfirmRegisterComponent } from "../../pages/confirm-register/confirm-register.component";

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskModule.forRoot(options),
  ],
  declarations: [
    ChangePasswordComponent,
    ConfirmRegisterComponent,
    ForgotPasswordComponent,
    LoginComponent,
    DialogResendVerificationEmail,
    PasswordStrengthComponent,
    RegisterComponent,
  ],
})
export class AuthLayoutModule {}
