import { Component, Renderer2 } from "@angular/core";
import * as FontFaceObserver from "fontfaceobserver";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "toodo.be";

  constructor(private renderer: Renderer2) {
    const materialIcons = new FontFaceObserver("Material Icons");
    materialIcons.load(null, 10000).then(() => {
      this.renderer.addClass(document.body, "material-icons-loaded");
    });
  }
}
