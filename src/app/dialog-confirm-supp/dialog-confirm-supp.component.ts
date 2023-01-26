import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-dialog-confirm-supp',
  templateUrl: './dialog-confirm-supp.component.html',
  styleUrls: ['./dialog-confirm-supp.component.scss']
})
export class DialogConfirmSuppComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogConfirmSuppComponent>) {
  }

  onConfirm() {
    // Appeler la fonction de suppression ici
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
  }

}
