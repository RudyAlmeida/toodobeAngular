import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertService, DocumentsService } from "../../../_services";

@Component({
  selector: "app-documents-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DocumentsDetailsComponent implements OnInit {
  loading = false;
  dataForm: any = {};
  formId = null;
  profile = null;

  @ViewChild("fileInput") fileInput;

  constructor(
    private alertService: AlertService,
    private documentsService: DocumentsService,
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
      } else {
        this.cancel();
      }
    });
  }

  getById(id: string = "") {
    this.loading = true;
    this.documentsService.get(id).subscribe(
      (data) => {
        this.loading = false;
        this.dataForm = data;
      },
      ({ error }) => {
        this.loading = false;
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
          10000,
          true
        );

        this.cancel();
      }
    );
  }

  ngOnInit() {
    if (this.formId) {
      this.getById(this.formId);
      return;
    }
  }

  cancel() {
    this.router.navigate(["/documentos"]);
  }
}
