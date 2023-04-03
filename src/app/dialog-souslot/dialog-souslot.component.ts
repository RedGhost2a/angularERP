import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {SousLot} from "../_models/sous-lot";
import {SousLotService} from "../_service/sous-lot.service";

@Component({
  selector: 'app-dialog-souslot',
  templateUrl: './dialog-souslot.component.html',
  styleUrls: ['./dialog-souslot.component.scss']
})
export class DialogSouslotComponent implements OnInit {

  initialData!: SousLot;
  myFormGroup!: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: SousLot, private dialogRef: MatDialogRef<DialogComponent>,
              private sousLotService : SousLotService) {
    this.initialData = this.data;
  }

  ngOnInit(): void {
    this.createFormSousLot()

  }

  createFormSousLot() {
    this.myFormGroup = new FormGroup({
      designation: new FormControl(this.initialData.designation)
    })
  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }
  updateSousLots(){
    this.sousLotService.update(this.myFormGroup.getRawValue(),this.initialData.id).subscribe()
  }
}
