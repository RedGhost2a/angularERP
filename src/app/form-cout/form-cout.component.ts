import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CoutService} from "../_service/cout.service";
import {ActivatedRoute} from '@angular/router';
import {UserService} from "../_service/user.service"
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {Cout} from "../_models/cout";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import{transformVirguletoPoint} from "../_helpers/transformVirguletoPoint"
import {DataSharingService} from "../_service/data-sharing-service.service";


interface FournisseurCout {
  CoutId: number;
  Fournisseurid: number;
}

@Component({
  selector: 'app-form-cout',
  templateUrl: './form-cout.component.html',
  styleUrls: ['./form-cout.component.scss']
})
export class FormCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Ajouter ce composant";
  titreForm: string = "Ajout d'un composant dans la blibliothèque de prix";
  textForm: string = "L'ajout d'un composant permet de l'utiliser au sein de la bibliothèque de prix et dans la création de devis"
  typeCout !: TypeCout[];
  fournisseur!: Fournisseur[];
  userId = this.userService.userValue.id;
  initialData: any
  cout!: Cout
  regexSousDetail = new RegExp(`^/sousDetailPrix`)
  regexCout = new RegExp(`^/listCout`)
  isCout: boolean = true;
  categories: any[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: Cout,
              private dialogRef: MatDialogRef<DialogComponent>,
              private formBuilder: FormBuilder,
              private coutService: CoutService,
              private route: ActivatedRoute,
              private userService: UserService,
              private fournisseurService: FournisseurService,
              private typeCoutService: TypeCoutService,
              public datasharingService: DataSharingService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) {
    this.initialData = this.data;
  }


  ngOnInit(): void {
    this.createFormCout();
    transformVirguletoPoint()
    this.getUserById();
    console.log(window.location.pathname)
    if (this.regexSousDetail.test(window.location.pathname))
      this.isCout = false;
    if (this.initialData !== null)
      this.generateFormUpdate();
  }

  //Determine si c'est l'ajout d'un nouveau cout ou la modification d'un cout existant au click
  createAndUpdate(): void {
    console.log(this.myFormGroup.getRawValue())

    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData === null) {
      this.coutService.create(this.myFormGroup.getRawValue()).subscribe(data => {
        this.closeDialog()
      });
    }
    if (this.regexCout.test(window.location.pathname)) {
      this.coutService.update(this.myFormGroup.getRawValue(), this.initialData.id).subscribe(() => {
        this.closeDialog()
      });
    }
    if (this.regexSousDetail.test(window.location.pathname)) {
      this.coutService.updateCoutDuDevis(this.myFormGroup.getRawValue(), this.initialData.id).subscribe(() => {
        this.closeDialog()
      })
    }
  }


  //Recupere l'id de l'entreprise de l'utilisateur courant, et creer le formulaire
  getUserById(): void {
    this.userService.getById(this.userId).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id),
        this.getAllTypeCouts(data.Entreprises[0].id)
      this.getAllFournisseur(data.Entreprises[0].id)
    })
  }

  createFormCout(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl("", Validators.required),
      unite: new FormControl("", Validators.required),
      prixUnitaire: new FormControl("", Validators.required),
      EntrepriseId: new FormControl(),
      TypeCoutId: new FormControl(""),
      FournisseurId: new FormControl("")
    });
  }


//Recupere tous les type de couts pour implementer le select picker du template
  getAllTypeCouts(entrepriseID: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(data => {
        this.typeCout = data;
        console.log(this.typeCout)

      }
    )
  }

  getCategorieByType(type: string): void {
    this.typeCoutService.getCategorieByType(type).subscribe(data => {
      this.categories = data;

      console.log(this.categories);
    });
  }


  //Recupere tous les fournisseurs pour implementer le select picker du template
  getAllFournisseur(entrepriseId: number): void {
    this.fournisseurService.getAllFournisseurs(entrepriseId).subscribe(data => {
      this.fournisseur = data;
      //this.typeCout = Array.from(this.typeCout.reduce((m, t) => m.set(t.type, t), new Map()).values());
    })
  }

  //Genere le formulaire de modification avec la data du cout selectionnner, change le titre du formulaire
  //et le texte du bouton de validation
  generateFormUpdate(): void {
    this.titreForm = "Modification d'un composant de la bibliothèque de prix"
    this.textForm = "La modification de ce composant va impacter les ouvrages de la bibliothèque de prix associés. Les devis déjà existants ne seront pas modifiés."
    this.textButton = "Modifier ce composant"
    this.myFormGroup.patchValue(this.initialData)
  }



  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }


}

