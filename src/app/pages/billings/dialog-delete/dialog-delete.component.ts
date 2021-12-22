import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-billings-delete",
  templateUrl: "dialog-delete.component.html",
})
export class DialogDeleteBillingsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteBillingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    this.dialogRef.close(this.data.selectedId);
  }
}
