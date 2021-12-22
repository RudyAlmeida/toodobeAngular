import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Ng2ImgMaxService } from "ng2-img-max";

import * as jsPDF from "jspdf";

import {
  AdminService,
  AlertService,
  DocumentsService,
} from "../../../_services";
import { Documents } from "../../../_models";

@Component({
  selector: "app-documents-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class DocumentsRegisterComponent implements OnInit {
  documentForm: FormGroup;
  documentPreview = null;
  disabled = true;
  loading = false;
  loadingResult = false;
  dataForm: any = {};
  formId = null;
  profile = null;
  users: any;
  invalidTypeFile = false;
  selectedStatus = null;
  documentStatus = [
    { id: "aguardando", name: "Aguardando" },
    { id: "enviado", name: "Enviado" },
    { id: "aprovado", name: "Aprovado" },
    { id: "recusado", name: "Recusado" },
  ];
  doc = null;
  pdfBlobFile: any = "";
  documentsPreviews = [];
  uploadResponse = { status: "", message: "" };

  loadingFiles = false;
  loadedFilesPercentage = 0;

  @ViewChild("fileInput") fileInput;

  constructor(
    private alertService: AlertService,
    private adminService: AdminService,
    private documentsService: DocumentsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ng2ImgMax: Ng2ImgMaxService
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
      this.disabled = false;
      this.adminService.listUsers(0, 100000, "").subscribe(
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

  hasError = (controlName: string, errorName: string) => {
    return this.documentForm.controls[controlName].hasError(errorName);
  };

  buildForm() {
    this.documentForm = this.formBuilder.group({
      id: [this.dataForm.id || "", [Validators.required]],
      user_id: [
        {
          value: this.dataForm.user_id || this.profile.id,
          disabled: this.disabled,
        },
        [Validators.required],
      ],
      document_name: [
        { value: this.dataForm.document_name || "", disabled: this.disabled },
      ],
      user_file: [this.dataForm.user_file || "", [Validators.required]],
      document_status: [
        this.dataForm.document_status || "",
        [Validators.required],
      ],
    });
  }

  onSelectFile = (event) => {
    this.documentPreview = null;
    this.documentsPreviews = [];
    this.doc = new jsPDF();
    this.loadingFiles = true;

    this.pdfBlobFile = null;

    if (event.target.files) {
      this.invalidTypeFile = false;
      let queue = event.target.files.length;

      for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        if (!file.type.startsWith("image/")) {
          this.invalidTypeFile = true;
          this.fileInput.nativeElement.value = null;
          this.loadingFiles = false;
          break;
        }
      }

      this.readFile(event.target.files, 0, queue);
    }
  };

  readFile(files, index, queue) {
    const file = files[index];

    this.ng2ImgMax.compressImage(file, 1).subscribe(
      (result) => {

        let reader = new FileReader();

        reader.readAsDataURL(result); // read file as data url

        reader.onloadend = (event) => {
          // called once readAsDataURL is completed
          this.documentPreview = event.target.result;

          this.documentsPreviews.push(this.documentPreview);

          const img = new Image();

          let objectUrl = this.documentPreview;

          img.onload = async (image: any) => {
            const { width, height } = image.target;

            const pdfWidth = this.doc.internal.pageSize.getWidth();

            const useWidth = width < pdfWidth ? width : pdfWidth;

            const pdfHeight = (height * useWidth) / width;

            await this.doc.addImage(
              this.documentPreview,
              "JPEG",
              0,
              5,
              useWidth,
              pdfHeight
            );

            const queueAux = queue - 1;

            var porcentagem = ((index + 1) / files.length) * 100;
            this.loadedFilesPercentage = Math.round(porcentagem);

            if (!queueAux) {
              this.proccessPDF();
            } else {
              await this.doc.addPage("a4", "p");
              this.readFile(files, index + 1, queueAux);
            }
          };
          img.src = objectUrl;

          // this.doc.save('a4.pdf')
        };
      },
      (error) => {
        console.log("😢 Oh no!", error);
      }
    );
  }

  proccessPDF = async () => {
    this.pdfBlobFile = await this.doc.output("blob");
    this.loadingFiles = false;
  };

  getById(id: string = "") {
    this.loadingResult = true;
    this.documentsService.get(id).subscribe(
      (data) => {
        this.loadingResult = false;
        this.dataForm = data;
        this.selectedStatus = data.document_status;
        this.buildForm();
      },
      ({ error }) => {
        this.loadingResult = false;
        this.alertService.error(
          error?.error ||
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
    this.buildForm();
  }

  cancel() {
    this.router.navigate(["/documentos"]);
  }

  onSubmit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    let data: Documents = { ...this.documentForm.value };

    if (!data.user_id) {
      data.user_id = this.profile.id;
    }

    if (!data.document_name) {
      data.document_name = this.dataForm.document_name;
    }

    if (!data.document_status) {
      data.document_status = this.dataForm.document_status;
    }

    if (this.fileInput) {
      const fi = this.fileInput.nativeElement;

      if (fi.files && fi.files[0]) {
        data.user_file = this.pdfBlobFile; //fi.files[0];
      }
    }

    this.documentsService.save(this.formId, data).subscribe(
      (data) => {
        debugger;
        this.uploadResponse = data;

        if (this.uploadResponse?.message != "100") {
          return;
        }
        this.loading = false;
        this.alertService.success("Dados salvos com sucesso!", 8000, true);
        this.router.navigate(["/documentos"]);
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
            "Ops!!! algo deu errado, por favor tente novamente mais tarde."
        );
      }
    );
  }
}
