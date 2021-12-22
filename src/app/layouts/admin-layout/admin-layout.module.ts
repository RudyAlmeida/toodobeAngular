import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { ClipboardModule } from "ngx-clipboard";

import { MaterialModule } from "../../material.module";

import { CreditCardValidators } from "../../_validators";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { BillingsComponent } from "../../pages/billings/billings.component";
import { BillingsRegisterComponent } from "../../pages/billings/register/register.component";
import { BillingsDetailsComponent } from "../../pages/billings/details/details.component";
import { DialogDeleteBillingsComponent } from "../../pages/billings/dialog-delete/dialog-delete.component";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { DocumentsComponent } from "../../pages/documents/documents.component";
import { DocumentsRegisterComponent } from "../../pages/documents/register/register.component";
import { DialogDeleteDocumentComponent } from "../../pages/documents/dialog-delete/dialog-delete.component";
import { DocumentsDetailsComponent } from "../../pages/documents/details/details.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { MatGoogleMapsAutocompleteModule } from "@angular-material-extensions/google-maps-autocomplete";
import { AgmCoreModule } from "@agm/core";

import { NetworkComponent } from "../../pages/network/network.component";
import { AccordionComponent } from "../../pages/network/accordion/accordion.component";
import { BonusComponent } from "../../pages/bonus/bonus.component";
import { CertificatesComponent } from "../../pages/certificates/certificates.component";
import { CheckoutComponent } from "../../pages/checkout/checkout.component";
import { EventsComponent } from "../../pages/events/events.component";
import { EventRegisterComponent } from "../../pages/events/register/register.component";
import { MarketingComponent } from "../../pages/marketing/marketing.component";
import { SuportComponent } from "../../pages/suport/suport.component";
import { SubscriptionsComponent } from "../../pages/subscriptions/subscriptions.component";
import { SubscriptionsRegisterComponent } from "../../pages/subscriptions/register/register.component";
import { SubscriptionsDetailsComponent } from "../../pages/subscriptions/details/details.component";
import { DialogDeleteSubscriptionsComponent } from "../../pages/subscriptions/dialog-delete/dialog-delete.component";
import { UniversityComponent } from "../../pages/university/university.component";

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  imports: [
    Ng2ImgMaxModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MaterialModule,
    ClipboardModule,
    NgxMaskModule.forRoot(options),
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAm3LU9RZiiSWrJHYimmopadeFgt-KBLwQ",
      libraries: ["places"],
      region: "BR",
      language: "pt-BR",
    }),
  ],
  declarations: [
    BillingsComponent,
    BillingsRegisterComponent,
    BillingsDetailsComponent,
    DialogDeleteBillingsComponent,
    CheckoutComponent,
    DashboardComponent,
    DocumentsComponent,
    DocumentsRegisterComponent,
    DocumentsDetailsComponent,
    DialogDeleteDocumentComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    NetworkComponent,
    AccordionComponent,
    BonusComponent,
    CertificatesComponent,
    EventsComponent,
    MarketingComponent,
    SuportComponent,
    UniversityComponent,
    EventRegisterComponent,
    CreditCardValidators,
    SubscriptionsComponent,
    SubscriptionsRegisterComponent,
    SubscriptionsDetailsComponent,
    DialogDeleteSubscriptionsComponent,
  ],
  providers: [],
})
export class AdminLayoutModule {}
