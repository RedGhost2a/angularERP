import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FournisseurService} from "../_service/fournisseur.service";
import {ActivatedRoute} from "@angular/router";
import {Fournisseur} from "../_models/fournisseur";



@Component({
  selector: 'app-form-fournisseur',
  templateUrl: './form-fournisseur.component.html',
  styleUrls: ['./form-fournisseur.component.scss']
})
export class FormFournisseurComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Ajouter le fournisseur";
  titreForm: string = "Création d'un fournisseur";
  fournisseurs!:Fournisseur;

  constructor(private formBuilder:FormBuilder,private fournisseurService: FournisseurService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.createFormFournisseur()
    this.generateFormUpdate()
  }

  createFormFournisseur():void{
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      commercialName: new FormControl(),
      remarque: new FormControl(),
    });
   }
  createAndUpdate(): void {
    this.route.params.subscribe(params => {
      const fournisseurID = +params['id']
      if (isNaN(fournisseurID)) {
        this.fournisseurService.createFournisseur(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            alert('Nouveau fournisseur enregistrer')
          }
        );
      } else {
        this.fournisseurService.updateFournisseur(fournisseurID, this.myFormGroup.getRawValue())
          .subscribe((data): void => {
            alert('Fournisseur modifier')
          });
      }
    })
  }


  generateFormUpdate(): void {
    this.route.params.subscribe(params => {
      const fournisseurID = +params['id']
      if (!isNaN(fournisseurID)) {
        this.textButton = 'Modifier le cout'
        this.titreForm = 'Modification du cout'
        this.fournisseurService.getFournisseurById(fournisseurID).subscribe(data => {
          data = {
            id: data.id,
            commercialName: data.commercialName,
            remarque: data.remarque
          }
          this.myFormGroup.patchValue(data);
        });
      }
    })

  }

}
