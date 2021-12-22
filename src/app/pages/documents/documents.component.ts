import {
  Component,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, fromEvent, Observable, of as observableOf } from "rxjs";
import {
  catchError,
  map,
  startWith,
  tap,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";

import { AlertService, DocumentsService } from "../../_services";
import { DocumentsList } from "../../_models";

import { DialogDeleteDocumentComponent } from "./dialog-delete/dialog-delete.component";

import { columns } from "./const-data";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent implements AfterViewInit {
  isLoadingResults = false;
  recordsTotal = 0;
  dataTableInfo = columns;
  dataSource = [];
  selectedId = null;
  profile: any = {};

  displayedColumns: string[];
  listFormsDatabase: ListFormsHttpDatabase | null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("search") search: ElementRef;

  constructor(
    private cdRef: ChangeDetectorRef,
    private documentsService: DocumentsService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private router: Router
  ) {
    const userData = localStorage.getItem("userData");

    const {
      user: { profile },
    } = JSON.parse(userData);

    this.profile = profile;

    if (profile.role !== "admin") {
      const index = columns.headers.indexOf("delete");
      if (index > -1) {
        columns.headers.splice(index, 1);
      }
      delete columns.titles.delete;
    }
  }

  ngAfterViewInit() {
    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadList();
        })
      )
      .subscribe();

    this.displayedColumns = this.dataTableInfo.headers;

    this.listFormsDatabase = new ListFormsHttpDatabase(this.documentsService);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        tap(() => this.loadList())
      )
      .subscribe();
    this.cdRef.detectChanges();
  }

  loadList() {
    this.isLoadingResults = true;
    return this.listFormsDatabase!.getDocuments(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.search.nativeElement.value
    )
      .pipe(
        map((result) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.recordsTotal = result.total;

          return result.data;
        }),
        catchError((error) => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe((data) => (this.dataSource = data));
  }

  register() {
    if (this.profile.role !== "admin") return;
    this.router.navigate([`/documento`]);
  }

  sendToEdit(id: string) {
    this.router.navigate([`/documento/${id}`]);
  }

  sendToView(id: string) {
    this.router.navigate([`/detalhes-documento/${id}`]);
  }

  setSelectedId = (id: string = "") => {
    if (this.profile.role !== "admin") return;
    this.selectedId = id;
    const dialogRef = this.dialog.open(DialogDeleteDocumentComponent, {
      width: "350px",
      data: { selectedId: this.selectedId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.selectedId === result) {
        this.deleteRegistrationForm();
      }
    });
  };

  deleteRegistrationForm() {
    this.isLoadingResults = true;
    this.documentsService.delete(this.selectedId).subscribe(
      (data) => {
        this.loadList();
        this.alertService.success("Excluído com sucesso !!!");
      },
      ({ error }) => {
        this.isLoadingResults = false;
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

export class ListFormsHttpDatabase {
  constructor(private documentsService: DocumentsService) {}

  getDocuments(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    search: string
  ): Observable<DocumentsList> {
    return this.documentsService.list(page, pageSize, search);
  }
}
