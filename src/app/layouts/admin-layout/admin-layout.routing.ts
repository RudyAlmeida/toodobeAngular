import { Routes } from "@angular/router";

import { AuthGuard } from "../../_guards";

import { BillingsComponent } from "../../pages/billings/billings.component";
import { BillingsRegisterComponent } from "../../pages/billings/register/register.component";
import { BillingsDetailsComponent } from "../../pages/billings/details/details.component";
import { BonusComponent } from "../../pages/bonus/bonus.component";
import { CertificatesComponent } from "../../pages/certificates/certificates.component";
import { CheckoutComponent } from "../../pages/checkout/checkout.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { DocumentsComponent } from "../../pages/documents/documents.component";
import { DocumentsRegisterComponent } from "../../pages/documents/register/register.component";
import { DocumentsDetailsComponent } from "../../pages/documents/details/details.component";
import { EventsComponent } from "../../pages/events/events.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { MarketingComponent } from "../../pages/marketing/marketing.component";
import { NetworkComponent } from "../../pages/network/network.component";
import { EventRegisterComponent } from "../../pages/events/register/register.component";
import { SubscriptionsComponent } from "../../pages/subscriptions/subscriptions.component";
import { SubscriptionsRegisterComponent } from "../../pages/subscriptions/register/register.component";
import { SubscriptionsDetailsComponent } from "../../pages/subscriptions/details/details.component";
import { SuportComponent } from "../../pages/suport/suport.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { UniversityComponent } from "../../pages/university/university.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: "cobrancas",
    component: BillingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "cobranca/:id",
    component: BillingsRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "cobranca",
    component: BillingsRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "detalhes-cobranca/:id",
    component: BillingsDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "assinaturas",
    component: SubscriptionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "assinatura/:id",
    component: SubscriptionsRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "assinatura",
    component: SubscriptionsRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "detalhes-assinatura/:id",
    component: SubscriptionsDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "perfil-usuario",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: "bonus", component: BonusComponent, canActivate: [AuthGuard] },
  { path: "eventos", component: EventsComponent, canActivate: [AuthGuard] },
  {
    path: "cadastrar-evento",
    component: EventRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "editar-evento/:id",
    component: EventRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "certificados",
    component: CertificatesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "checkout",
    component: CheckoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "documentos",
    component: DocumentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "documento/:id",
    component: DocumentsRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "documento",
    component: DocumentsRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "detalhes-documento/:id",
    component: DocumentsDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "marketing",
    component: MarketingComponent,
    canActivate: [AuthGuard],
  },
  { path: "rede", component: NetworkComponent, canActivate: [AuthGuard] },
  { path: "suporte", component: SuportComponent, canActivate: [AuthGuard] },
  {
    path: "universidade",
    component: UniversityComponent,
    canActivate: [AuthGuard],
  },

  { path: "tables", component: TablesComponent, canActivate: [AuthGuard] },
  { path: "icons", component: IconsComponent, canActivate: [AuthGuard] },
  { path: "maps", component: MapsComponent, canActivate: [AuthGuard] },
];
