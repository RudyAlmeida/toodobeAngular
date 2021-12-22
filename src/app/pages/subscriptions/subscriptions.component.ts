import {
  Component,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, Observable, of as observableOf } from "rxjs";
import { catchError, map, startWith, tap } from "rxjs/operators";

import { AlertService, SubscriptionsService } from "../../_services";
import { SubscriptionsList } from "../../_models";

import { DialogDeleteSubscriptionsComponent } from "./dialog-delete/dialog-delete.component";

import { columns } from "./const-data";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";

const moment = _moment;

@Component({
  selector: "app-subscriptions",
  templateUrl: "./subscriptions.component.html",
  styleUrls: ["./subscriptions.component.scss"],
})
export class SubscriptionsComponent implements AfterViewInit {
  isLoadingResults = false;
  recordsTotal = 0;
  dataTableInfo = columns;
  dataSource = [];
  selectedId = null;
  profile = null;

  displayedColumns: string[];
  listFormsDatabase: ListFormsHttpDatabase | null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private cdRef: ChangeDetectorRef,
    private subscriptionsService: SubscriptionsService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private router: Router
  ) {
    const userData = localStorage.getItem("userData");

    const {
      user: { profile },
    } = JSON.parse(userData);

    this.profile = profile;
  }

  ngAfterViewInit() {
    this.displayedColumns = this.dataTableInfo.headers;

    this.listFormsDatabase = new ListFormsHttpDatabase(
      this.subscriptionsService
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
    return this.listFormsDatabase!.getSubscriptions(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      ""
    )
      .pipe(
        map((result) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.recordsTotal = result.total;

          result.data.forEach((item: any) => {
            item.value = item.value.replace(".", ",");
            item.next_due_date = moment(item.next_due_date).format(
              "DD/MM/YYYY"
            );
          });

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
    this.router.navigate([`/assinatura`]);
  }

  sendToEdit(id: string) {
    this.router.navigate([`/assinatura/${id}`]);
  }

  sendToView(id: string) {
    this.router.navigate([`/detalhes-assinatura/${id}`]);
  }

  setSelectedId = (id: string = "") => {
    this.selectedId = id;
    const dialogRef = this.dialog.open(DialogDeleteSubscriptionsComponent, {
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
    this.subscriptionsService.delete(this.selectedId).subscribe(
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
  constructor(private subscriptionsService: SubscriptionsService) {}

  getSubscriptions(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    search: string
  ): Observable<SubscriptionsList> {
    return this.subscriptionsService.list(page, pageSize, search);
  }
}
