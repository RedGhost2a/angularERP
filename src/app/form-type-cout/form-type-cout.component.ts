import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {map, Observable, startWith} from "rxjs";
import {Entreprise} from "../_models/entreprise";

@Component({
  selector: 'app-form-type-cout',
  templateUrl: './form-type-cout.component.html',
  styleUrls: ['./form-type-cout.component.scss']
})
export class FormTypeCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Ajouter un type de cout";
  titreForm: string = "Création d'un type de cout";
  textForm: string = "L'ajout d'un type de cout permet de l'associer à un composant"
  initialData: TypeCout
  typeCout!: TypeCout;
  options: string [] = []
  // Déclare une propriété pour stocker les options filtrées
  filteredOptions!: Observable<string[]>;
  currentEntreprise : Entreprise [] = []


  constructor(@Inject(MAT_DIALOG_DATA) public data: TypeCout,
              private dialogRef: MatDialogRef<DialogComponent>,
              private formBuilder: FormBuilder,
              private typeCoutService: TypeCoutService,
              private route: ActivatedRoute,
              private userService: UserService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) {
    this.initialData = this.data;
  }

  ngOnInit(): void {
    this.createFormTypeCout();
    this.getUserEntreprise();
    console.log(this.initialData)
    if (this.initialData){
    this.getAllTypeCouts(this.initialData.EntrepriseId)
      this.generateFormUpdate();

    }else {
      this.myFormGroup.get('EntrepriseId')!.valueChanges.subscribe(entrepriseId => {
        if (entrepriseId) {
          this.getAllTypeCouts(entrepriseId);
        }
      });

    }
    this.filteredOptions = this.myFormGroup.get('type')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterOptions(value))
      );

  }

  createFormTypeCout(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      type: new FormControl("", Validators.required),
      categorie: new FormControl("", Validators.required),
      EntrepriseId: new FormControl("",Validators.required),
    });
  }

  createAndUpdate(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }

    if (this.initialData === null) {
      this.typeCoutService.createTypeCout(this.myFormGroup.getRawValue()).subscribe(data => {
        this.closeDialog()

      });
    } else {
      this.typeCoutService.updateTypeCout(this.initialData.id, this.myFormGroup.getRawValue()).subscribe();
        this.closeDialog()
    }
  }

  getUserEntreprise(): void {
    this.currentEntreprise = this.userService.currentUser.Entreprises;
    console.log(this.currentEntreprise)
  }


  generateFormUpdate(): void {
    this.titreForm = "Modification d'un type de composant"
    this.textForm = "La modification du type de composant va impacter les composants qui lui sont associés dans la blibliothèque de prix. Les devis déjà existants ne seront pas modifiés."
    this.textButton = "Modifier ce type de composant"
    this.myFormGroup.patchValue(this.initialData)
  }

  //Recupere tous les type de couts pour implementer le select picker du template
  getAllTypeCouts(entrepriseID: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(data => {
        this.options = data.map(option => option.type);
        // Filtrer les doublons dans le tableau options
        this.options = this.options.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
        console.log(this.options)
      }
    )
  }

  //  méthode pour filtrer les options en fonction de la valeur saisie par l'utilisateur
  filterOptions(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0).slice(0, 10);
  }

  // Affiche la valeur sélectionnée dans linput
  displayFn(option: string): string {
    return option ? option : '';
  }


  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

}
