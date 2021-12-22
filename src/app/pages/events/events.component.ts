import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
})
export class EventsComponent implements OnInit {
  loading = false;
  events = [
    {
      title: "Encontro",
      subTitle: "Em new york",
      description: "Encontro vendedores nova york",
      date: "18/04/2020",
      time: "15:30",
      location: { lat: 40.714728, long: -73.998672 },
      img: "",
    },
    {
      title: "Espaço nobre eventos",
      subTitle: "Em São Paulo",
      description: "Encontro vendedores sp",
      location: { lat: -23.5887808, long: -46.6499624 },
      date: "24/04/2020",
      time: "18:30",
      img: "",
    },
    {
      title: "Encontro",
      description: "Encontro vendedores nova york",
      location: { lat: 40.714728, long: -73.998672 },
      date: "25/04/2020",
      time: "20:00",
      img: "",
    },
  ];
  constructor(private router: Router) {}

  ngOnInit() {
    this.events.forEach((item) => {
      item.img = `https://maps.googleapis.com/maps/api/staticmap?center=${item.location.lat},${item.location.long}&zoom=14&size=600x100&key=AIzaSyAm3LU9RZiiSWrJHYimmopadeFgt-KBLwQ`;
    });
  }

  register() {
    this.router.navigate(["/cadastrar-evento"]);
  }
}
