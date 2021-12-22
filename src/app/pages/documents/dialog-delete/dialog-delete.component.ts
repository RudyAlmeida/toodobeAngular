import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-delete",
  templateUrl: "dialog-delete.component.html",
})
export class DialogDeleteDocumentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    this.dialogRef.close(this.data.selectedId);
  }
}
