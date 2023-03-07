import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_service/user.service";
import {Cout} from "../_models/cout";
import {Fournisseur} from "../_models/fournisseur";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";

@Component({
  selector: 'app-form-type-cout',
  templateUrl: './form-type-cout.component.html',
  styleUrls: ['./form-type-cout.component.scss']
})
export class FormTypeCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Ajouter un type de cout";
  titreForm: string = "Création d'un type de cout";
  textForm : string = "L'ajout d'un type de cout permet de l'associer à un composant"
  initialData: TypeCout
  typeCout!:TypeCout;
  userId = this.userService.userValue.id;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TypeCout, private dialogRef: MatDialogRef<DialogComponent>,
              private formBuilder:FormBuilder,private typeCoutService: TypeCoutService,
              private route: ActivatedRoute, private  userService: UserService) {
    this.initialData = this.data;
  }

  ngOnInit(): void {
    this.createFormTypeCout();
    this.getUserById();
    if (this.initialData !== null)
      this.generateFormUpdate();
  }

  createFormTypeCout():void{
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      type: new FormControl(),
      categorie: new FormControl(),
      EntrepriseId: new FormControl(),
    });
  }
  createAndUpdate(): void {
    if (this.initialData === null) {
      this.typeCoutService.createTypeCout(this.myFormGroup.getRawValue()).subscribe();
    } else {
      this.typeCoutService.updateTypeCout(this.initialData.id, this.myFormGroup.getRawValue()).subscribe();
    }
  }
  getUserById(): void {
    this.userService.getById(this.userId).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
    })
  }



  generateFormUpdate(): void {
    this.titreForm = "Modification d'un type de composant"
    this.textForm = "La modification du type de composant va impacter les composants qui lui sont associés dans la blibliothèque de prix. Les devis déjà existants ne seront pas modifiés."
    this.textButton = "Modifier ce type de composant"
    this.myFormGroup.patchValue(this.initialData)
  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

}
