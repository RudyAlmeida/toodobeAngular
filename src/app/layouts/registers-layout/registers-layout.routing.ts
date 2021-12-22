import { Routes } from "@angular/router";

import { AuthGuard } from "../../_guards";

import { RegistrationFormListComponent } from "src/app/pages/registers/registration-forms/registration-form-list.component";
import { RegistrationFormsComponent } from "../../pages/registers/registration-forms/register/registration-forms.component";
import { BankInformationsFormsComponent } from "../../pages/registers/bank-informations-forms/register/bank-informations-forms.component";
import { BankListComponent } from "../../pages/registers/bank-informations-forms/bank-list.component";
import { ProjectsFormsComponent } from "../../pages/registers/projects-forms/register/projects-forms.component";
import { ProjectsListComponent } from "src/app/pages/registers/projects-forms/projects-list.component";

export const RegistersLayoutRoutes: Routes = [
  {
    path: "fichas-cadastrais",
    component: RegistrationFormListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "ficha-cadastral",
    component: RegistrationFormsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "ficha-cadastral/:id",
    component: RegistrationFormsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dados-bancarios",
    component: BankListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dados-banco",
    component: BankInformationsFormsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dados-banco/:id",
    component: BankInformationsFormsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "projetos",
    component: ProjectsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "projeto",
    component: ProjectsFormsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "projeto/:id",
    component: ProjectsFormsComponent,
    canActivate: [AuthGuard],
  },
];
