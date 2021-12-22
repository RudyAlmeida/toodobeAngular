import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule, IConfig } from "ngx-mask";

import { ClipboardModule } from "ngx-clipboard";

import { MaterialModule } from "../../material.module";

import { DatePicker } from "../../_directives/datePickerYear.directive";

import { RegistersLayoutRoutes } from "./registers-layout.routing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

//Fichas cadastrais
import { DialogDeleteComponent } from "../../pages/registers/dialog-delete/dialog-delete.component";

import { RegistrationFormListComponent } from "src/app/pages/registers/registration-forms/registration-form-list.component";
import { RegistrationFormsComponent } from "../../pages/registers/registration-forms/register/registration-forms.component";
import { BankInformationsFormsComponent } from "../../pages/registers/bank-informations-forms/register/bank-informations-forms.component";
import { BankListComponent } from "../../pages/registers/bank-informations-forms/bank-list.component";
import { ProjectsFormsComponent } from "../../pages/registers/projects-forms/register/projects-forms.component";
import { ProjectsListComponent } from "src/app/pages/registers/projects-forms/projects-list.component";

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RegistersLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MaterialModule,
    ClipboardModule,
    NgxMaskModule.forRoot(options),
  ],
  declarations: [
    DialogDeleteComponent,
    BankListComponent,
    DatePicker,
    RegistrationFormsComponent,
    RegistrationFormListComponent,
    BankInformationsFormsComponent,
    ProjectsFormsComponent,
    ProjectsListComponent
  ],
  providers: [],
})
export class RegistersLayoutModule {}
