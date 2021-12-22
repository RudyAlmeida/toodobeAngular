import { Component, Input } from "@angular/core";

@Component({
  selector: "app-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./accordion.component.scss"],
})
export class AccordionComponent {
  qualification = {
    0: { text: "bronze", value: "12" },
    1: { text: "prata", value: "144" },
    2: { text: "ouro", value: "1.728" },
    3: { text: "diamante", value: "20736" },
  };

  @Input() members: any;

  constructor() {}
}
