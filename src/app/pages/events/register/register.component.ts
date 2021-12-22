import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Location } from "@angular-material-extensions/google-maps-autocomplete";
import PlaceResult = google.maps.places.PlaceResult;

import { AlertService, UserService } from "../../../_services";

declare const google: any;

@Component({
  selector: "app-event-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class EventRegisterComponent implements OnInit, AfterViewInit {
  profileForm: FormGroup;
  disabled = false;
  loading = false;
  zoom: number;
  latitude: number;
  longitude: number;
  eventId: number;

  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.eventId = params.id;
      }
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  };

  buildForm() {
    this.profileForm = this.formBuilder.group({
      title: [{ value: "", disabled: this.disabled }, [Validators.required]],
      subTitle: [{ value: "", disabled: this.disabled }],
      description: [
        { value: "", disabled: this.disabled },
        [Validators.required],
      ],
      location: ["", [Validators.required]],
      date: ["", [Validators.required]],
      time: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.buildForm();

    this.zoom = 10;
    this.latitude = 52.520008;
    this.longitude = 13.404954;

    this.setCurrentPosition();

    // this.buildMap();
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onAutocompleteSelected(result: PlaceResult) {
    // console.log("onAutocompleteSelected: ", result);
  }

  onLocationSelected(location: Location) {
    // console.log("onLocationSelected: ", location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.zoom = 14;
  }

  cancel() {
    this.router.navigate(["/eventos"]);
  }

  onSubmit() {
    //salvar evento
  }
}
