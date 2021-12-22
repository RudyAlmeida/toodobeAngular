import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { Currency } from "../../../../_utils";

import {
  AdminService,
  AlertService,
  PropertiesService,
  RegisterService,
} from "../../../../_services";

export interface AutocompleteItem {
  name: string;
  selected?: boolean;
}

export interface AutocompleteGroup {
  group: string;
  types: AutocompleteItem[];
}

export const _filter = (
  opt: AutocompleteItem[],
  value: string
): AutocompleteItem[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(
    (item) => item.name.toLowerCase().indexOf(filterValue) === 0
  );
};

@Component({
  selector: "app-projects-forms",
  templateUrl: "./projects-forms.component.html",
  styleUrls: ["./projects-forms.component.scss"],
})
export class ProjectsFormsComponent implements OnInit {
  dataProjects: any = {};
  users: any;
  formId: string;
  subscription: any = null;

  loadingProperties: boolean = false;
  displayedColumns: string[] = [
    "id",
    "property_value",
    "first_installment",
    "last_installment",
  ];
  dataSource = [];

  propertyTypeGroupOptions: Observable<AutocompleteGroup[]>;
  leisureSportOptions: Observable<AutocompleteItem[]>;
  amenitiesServicesOptions: Observable<AutocompleteItem[]>;
  safetyOptions: Observable<AutocompleteItem[]>;
  roomsOptions: Observable<AutocompleteItem[]>;

  selectedPropertyTypes: AutocompleteItem[] = [];
  selectedLeisureSport: AutocompleteItem[] = [];
  selectedAmenitiesServices: AutocompleteItem[] = [];
  selectedSafety: AutocompleteItem[] = [];
  selectedRooms: AutocompleteItem[] = [];

  propertyTypeGroups: AutocompleteGroup[] = [
    {
      group: "Residencial",
      types: [
        { name: "Apartamento" },
        { name: "Casa" },
        { name: "Casa de Condomínio" },
        { name: "Chácara" },
        { name: "Cobertura" },
        { name: "Flat" },
        { name: "Kitnet/Conjugado" },
        { name: "Lote/Terreno" },
        { name: "Sobrado" },
        { name: "Edifício Residencial" },
        { name: "Fazenda/Sítios/Chácaras" },
      ],
    },
    {
      group: "Comercial",
      types: [
        { name: "Consultório" },
        { name: "Galpão/Depósito/Armazém" },
        { name: "Imóvel Comercial" },
        { name: "Lote/Terreno" },
        { name: "Ponto Comercial/Loja/Box" },
        { name: "Sala/Conjunto" },
        { name: "Prédio/Edifício Inteiro" },
      ],
    },
  ];
  leisureSport: AutocompleteItem[] = [
    { name: "Academia" },
    { name: "Churrasqueira" },
    { name: "Cinema" },
    { name: "Espaço gourmet" },
    { name: "Espaço verde / Parque" },
    { name: "Gramado" },
    { name: "Jardim" },
    { name: "Piscina" },
    { name: "Pista de cooper" },
    { name: "Playground" },
    { name: "Quadra de squash" },
    { name: "Quadra de tênis" },
    { name: "Quadra poliesportiva" },
    { name: "Quintal" },
    { name: "Salão de festas" },
    { name: "Salão de jogos" },
  ];
  amenitiesServices: AutocompleteItem[] = [
    { name: "Aquecimento" },
    { name: "Ar-condicionado" },
    { name: "Conexão à internet" },
    { name: "Depósito" },
    { name: "Elevador" },
    { name: "Garagem" },
    { name: "Gerador elétrico" },
    { name: "Lareira" },
    { name: "Lavanderia" },
    { name: "Sala de massagem" },
    { name: "Mobiliado" },
    { name: "Recepção" },
    { name: "Sauna" },
    { name: "Spa" },
    { name: "TV a cabo" },
  ];
  safety: AutocompleteItem[] = [
    { name: "Circuito de segurança" },
    { name: "Condomínio fechado" },
    { name: "Interfone" },
    { name: "Segurança 24h" },
    { name: "Sistema de alarme" },
    { name: "Vigia" },
  ];
  rooms: AutocompleteItem[] = [
    { name: "Área de serviço" },
    { name: "Cozinha" },
    { name: "Escritório" },
    { name: "Varanda" },
    { name: "Varanda gourmet" },
  ];

  selectable = true;
  removable = true;

  profileForm: FormGroup;
  disabled = false;
  loadingSave = false;
  loadingResult = false;
  profile = null;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService,
    private registerService: RegisterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const userData = localStorage.getItem("userData");

    const {
      user: { profile },
    } = JSON.parse(userData);

    this.profile = profile;

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.formId = params.id;
      }
    });

    if (profile.role === "admin") {
      this.adminService.listUsers(0, 10000, "").subscribe(
        ({ data }) => {
          this.users = data;
        },
        (error) => {
          if (error.status === 403) {
            this.users = [];
          } else {
            const { error: erro } = error;
            this.alertService.error(
              erro?.error ||
                "Ops!!! algo deu errado, por favor tente novamente mais tarde.",
              7000,
              true
            );
          }
        }
      );
    }
  }

  ngOnInit() {
    if (this.formId) {
      this.getById(this.formId);
      return;
    }

    this.buildForm();
    this.loadProperty();
  }

  cancel() {
    this.router.navigate(["/projetos"]);
  }

  loadProperty(value?) {
    this.loadingProperties = true;

    this.propertiesService.getAll().subscribe(
      ({ data }) => {
        this.loadingProperties = false;

        if (value) {
          const item = data.find((item) => item.property_value == value);
          if (item) {
            this.profileForm.patchValue({
              project_value: item.id,
            });
          }
        }

        data.forEach((item) => {
          item.property_value = `R$ ${Currency.toBrasilianFormat(
            item.property_value
          )}`;
          item.first_installment = `R$ ${Currency.toBrasilianFormat(
            item.first_installment
          )}`;
          item.last_installment = `R$ ${Currency.toBrasilianFormat(
            item.last_installment
          )}`;
        });

        this.dataSource = data;
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
        this.loadingProperties = false;
      }
    );
  }

  getById(id: string = "") {
    this.loadingResult = true;
    this.registerService.getFormsByPathAndId("/projects", id).subscribe(
      (data) => {
        this.loadingResult = false;
        this.dataProjects = data;
        this.buildForm();
        this.loadProperty(this.dataProjects.project_value);
      },
      ({ error }) => {
        this.loadingResult = false;
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
            "Ops!!! algo deu errado, por favor tente novamente mais tarde.",
          13000,
          true
        );
        this.cancel();
      }
    );
  }

  hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  };

  isChecked = (item: AutocompleteItem) => {
    return this.selectedRooms.some((rooms) => rooms.name === item.name);
  };

  buildForm() {
    this.profileForm = this.formBuilder.group({
      user_id: [this.dataProjects.user_id || this.profile.id],
      project_desciption: [this.dataProjects.project_desciption || ""],
      project_value: [
        this.dataProjects?.project_value?.replace(".", ",") || "",
      ],
      property_type: [this.dataProjects.property_type || ""],
      bedrooms: [this.dataProjects.bedrooms || ""],
      parking_spaces: [this.dataProjects.parking_spaces || ""],
      leisure_sport: [this.dataProjects.leisure_sport || ""],
      amenities_services: [this.dataProjects.amenities_services || ""],
      safety: [this.dataProjects.safety || ""],
      rooms: [this.dataProjects.rooms || ""],
    });

    this.propertyTypeGroupOptions = this.profileForm
      .get("property_type")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterGroup(value))
      );

    this.leisureSportOptions = this.profileForm
      .get("leisure_sport")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterLeisureSport(value))
      );

    this.amenitiesServicesOptions = this.profileForm
      .get("amenities_services")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterAmenitiesServices(value))
      );

    this.safetyOptions = this.profileForm.get("safety")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterSafety(value))
    );

    if (this.dataProjects.id) {
      this.loadSelecteds();
    }
  }

  loadSelecteds() {
    this.dataProjects.amenities_services.map((item) =>
      this.toggleAmenitiesServicesSelection({ name: item })
    );
    this.dataProjects.leisure_sport.map((item) =>
      this.toggleLeisureSportSelection({ name: item })
    );
    this.dataProjects.property_type.map((item) =>
      this.toggleSelection({ name: item })
    );
    this.dataProjects.rooms.map((item) =>
      this.toggleRoomsSelection({ name: item })
    );
    this.dataProjects.safety.map((item) =>
      this.toggleSafetySelection({ name: item })
    );
  }

  private _filterGroup(value: string): AutocompleteGroup[] {
    if (value) {
      return this.propertyTypeGroups
        .map((group) => ({
          group: group.group,
          types: _filter(group.types, value),
        }))
        .filter((group) => group.types.length > 0);
    }

    return this.propertyTypeGroups;
  }

  private _filterLeisureSport(value: string): AutocompleteItem[] {
    const filterValue = value.toLowerCase();

    return this.leisureSport.filter(
      (leisureSport) =>
        leisureSport.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterAmenitiesServices(value: string): AutocompleteItem[] {
    const filterValue = value.toLowerCase();

    return this.amenitiesServices.filter(
      (amenitiesServices) =>
        amenitiesServices.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterSafety(value: string): AutocompleteItem[] {
    const filterValue = value.toLowerCase();

    return this.safety.filter(
      (safety) => safety.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  optionClicked(event: Event, item: AutocompleteItem) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  optionLeisureSportClicked(event: Event, item: AutocompleteItem) {
    event.stopPropagation();
    this.toggleLeisureSportSelection(item);
  }

  optionAmenitiesServicesClicked(event: Event, item: AutocompleteItem) {
    event.stopPropagation();
    this.toggleAmenitiesServicesSelection(item);
  }

  optionSafetyClicked(event: Event, item: AutocompleteItem) {
    event.stopPropagation();
    this.toggleSafetySelection(item);
  }

  toggleRoomsSelection(item: AutocompleteItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedRooms.push(item);
    } else {
      const i = this.selectedRooms.findIndex(
        (value) => value.name === item.name
      );
      this.selectedRooms.splice(i, 1);
    }
  }

  toggleSafetySelection(item: AutocompleteItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedSafety.push(item);
    } else {
      const i = this.selectedSafety.findIndex(
        (value) => value.name === item.name
      );
      this.selectedSafety.splice(i, 1);
    }
  }

  toggleAmenitiesServicesSelection(item: AutocompleteItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedAmenitiesServices.push(item);
    } else {
      const i = this.selectedAmenitiesServices.findIndex(
        (value) => value.name === item.name
      );
      this.selectedAmenitiesServices.splice(i, 1);
    }
  }

  toggleLeisureSportSelection(item: AutocompleteItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedLeisureSport.push(item);
    } else {
      const i = this.selectedLeisureSport.findIndex(
        (value) => value.name === item.name
      );
      this.selectedLeisureSport.splice(i, 1);
    }
  }

  toggleSelection(item: AutocompleteItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedPropertyTypes.push(item);
    } else {
      const i = this.selectedPropertyTypes.findIndex(
        (value) => value.name === item.name
      );
      this.selectedPropertyTypes.splice(i, 1);
    }
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid");
    this.scrollTo(firstElementWithError);
  }

  save() {
    if (this.profileForm.invalid) {
      this.scrollToError();
      return;
    }

    let data = { ...this.profileForm.value };

    if (!data.project_value) {
      this.alertService.error("Selecione um valor da tabela.", 7000);
      return;
    }

    data.project_value = this.dataSource.find(
      (item) => item.id == data.project_value
    ).property_value;
    data.project_value = data.project_value.replace("R$ ", "");
    data.project_value = data.project_value.replace(/\./g, "");
    data.project_value = data.project_value.replace(",", ".");

    data.amenities_services = this.selectedAmenitiesServices.map(
      ({ name }) => name
    );
    data.leisure_sport = this.selectedLeisureSport.map(({ name }) => name);
    data.property_type = this.selectedPropertyTypes.map(({ name }) => name);
    data.rooms = this.selectedRooms.map(({ name }) => name);
    data.safety = this.selectedSafety.map(({ name }) => name);

    //A api espera que os campos não preenchidos não sejam enviados.
    if (!data.project_desciption) delete data.project_desciption;
    if (!data.property_type) delete data.property_type;
    if (!data.bedrooms) delete data.bedrooms;
    if (!data.parking_spaces) delete data.parking_spaces;
    if (!data.leisure_sport) delete data.leisure_sport;
    if (!data.amenities_services) delete data.amenities_services;
    if (!data.safety) delete data.safety;
    if (!data.rooms) delete data.rooms;

    this.saveRegistrationForm(data);
  }

  saveRegistrationForm(data) {
    this.loadingSave = true;

    data.id = this.dataProjects.id;

    this.registerService.saveProjectsForm(this.dataProjects.id, data).subscribe(
      (data: any) => {
        this.dataProjects.id = data.id;
        this.subscription = data.subscription;
        this.loadingSave = false;
        this.alertService.success("Dados salvos com sucesso!");
      },
      ({ error }) => {
        this.loadingSave = false;
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
