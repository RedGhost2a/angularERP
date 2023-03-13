import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {OuvrageService} from "../_service/ouvrage.service";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {CoutService} from "../_service/cout.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Cout} from "../_models/cout";

@Component({
  selector: 'app-dialog-form-cout',
  templateUrl: './dialog-form-cout.component.html',
  styleUrls: ['./dialog-form-cout.component.scss']
})
export class DialogFormCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  initialData!: any[];
  coutDuDevis!:CoutDuDevis
  cout!: Cout;
  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>,
              private ouvrageService: OuvrageService, private dataSharingService : DataSharingService, private coutService : CoutService,
              private ouvrageCoutService : OuvrageCoutService)
  {
    this.initialData = this.data;
  }

  ngOnInit(): void {


    this.createFormCout()
  console.log("entreprise ID :",this.dataSharingService.entrepriseId)
  }

  createFormCout(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl(),
      unite: new FormControl(""),
      prixUnitaire: new FormControl(""),
      EntrepriseId: new FormControl(""),
      TypeCoutId: new FormControl(""),
      FournisseurId: new FormControl(""),
      ratio: new FormControl(""),
      uRatio: new FormControl(""),
      efficience: new FormControl("")
    });
  }
  createCoutDuDevis():void{
    this.myFormGroup.controls["EntrepriseId"].setValue(this.dataSharingService.entrepriseId)
    this.coutDuDevis = this.myFormGroup.getRawValue();
    this.coutDuDevis.fournisseur = this.myFormGroup.getRawValue().FournisseurId[0]
    this.coutDuDevis.remarque !== null ? this.myFormGroup.getRawValue().FournisseurId[1] : ""
    this.coutDuDevis.type = this.myFormGroup.getRawValue().TypeCoutId[0]
    this.coutDuDevis.categorie = this.myFormGroup.getRawValue().TypeCoutId[1]
    // console.log(this.myFormGroup.getRawValue())
    this.cout = this.myFormGroup.getRawValue();
    console.log("cout",this.cout)
    this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
    this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[2]
    this.coutService.create(this.cout).subscribe()

    this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
        const ouvrageCout: OuvrageCoutDuDevis = {
          OuvrageDuDeviId: this.dataSharingService.ouvrage.id,
          CoutDuDeviId: responseCout?.id,
          ratio: this.myFormGroup.getRawValue().ratio,
          uRatio:this.myFormGroup.getRawValue().uRatio,
        }
        this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe()
      }
    )
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }
}
