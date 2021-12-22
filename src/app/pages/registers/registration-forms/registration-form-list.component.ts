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

import { DialogDeleteComponent } from "../dialog-delete/dialog-delete.component";

import { AlertService, RegisterService } from "../../../_services";
import { RegisterFormsList } from "../../../_models";

import { columns, paths } from "./const-data";

@Component({
  selector: "app-registration-form-list",
  templateUrl: "./registration-form-list.component.html",
  styleUrls: ["./registration-form-list.component.scss"],
})
export class RegistrationFormListComponent implements AfterViewInit {
  isLoadingResults = false;
  recordsTotal = 0;
  dataTableInfo = columns;
  dataSource = [];
  selectedId = null;
  path = "/registration-form";
  profile: any = {};

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("search") search: ElementRef;

  constructor(
    private cdRef: ChangeDetectorRef,
    private registerService: RegisterService,
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

  displayedColumns: string[];
  listFormsDatabase: ListFormsHttpDatabase | null;

  register() {
    this.router.navigate([`/ficha-cadastral`]);
  }

  sendToEdit(id: string) {
    this.router.navigate([`/ficha-cadastral/${id}`]);
  }

  setSelectedId = (id: string = "") => {
    this.selectedId = id;
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
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
    this.registerService
      .deleteByPathAndId(this.path, this.selectedId)
      .subscribe(
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

    this.listFormsDatabase = new ListFormsHttpDatabase(
      paths.get(this.path),
      this.registerService
    );

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
    return this.listFormsDatabase!.getFormsByPath(
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
}

export class ListFormsHttpDatabase {
  constructor(private path: string, private registerService: RegisterService) {}

  getFormsByPath(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    search: string
  ): Observable<RegisterFormsList> {
    return this.registerService.getFormsByPath(
      this.path,
      page,
      pageSize,
      search
    );
  }
}
