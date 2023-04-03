import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Lot} from "../_models/lot";
import {LotService} from "../_service/lot.service";

@Component({
  selector: 'app-dialog-lot',
  templateUrl: './dialog-lot.component.html',
  styleUrls: ['./dialog-lot.component.scss']
})
export class DialogLotComponent implements OnInit {
  initialData!: Lot;
  myFormGroup!: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: Lot, private dialogRef: MatDialogRef<DialogComponent>,
              private lotService : LotService) {
    this.initialData = this.data;
  }

  ngOnInit(): void {
    this.createFormLot()

  }

  createFormLot() {
    this.myFormGroup = new FormGroup({
      designation: new FormControl(this.initialData.designation)
    })
  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }
  updateLots(){
    this.lotService.update(this.myFormGroup.getRawValue(),this.initialData.id).subscribe()
  }
}
