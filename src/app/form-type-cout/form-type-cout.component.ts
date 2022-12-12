import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_service/user.service";

@Component({
  selector: 'app-form-type-cout',
  templateUrl: './form-type-cout.component.html',
  styleUrls: ['./form-type-cout.component.scss']
})
export class FormTypeCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Ajouter le type de cout";
  titreForm: string = "Création d'un type de cout";
  typeCout!:TypeCout;
  userId = localStorage.getItem("userID");

  constructor(private formBuilder:FormBuilder,private typeCoutService: TypeCoutService,
              private route: ActivatedRoute, private  userService: UserService) { }

  ngOnInit(): void {
    this.createFormTypeCout();
    this.getUserById();
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
    this.route.params.subscribe(params => {
      const typeCoutID = +params['id']
      if (isNaN(typeCoutID)) {
        this.typeCoutService.createTypeCout(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            alert('Nouveau type de cout enregistrer')
          }
        );
      } else {
        this.typeCoutService.updateTypeCout(typeCoutID, this.myFormGroup.getRawValue())
          .subscribe((data): void => {
            alert('Fournisseur modifier')
          });
      }
    })
  }
  getUserById(): void {
    this.userService.getById(this.userId).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
    })
  }


  generateFormUpdate(): void {
    this.route.params.subscribe(params => {
      const typeCoutID = +params['id']
      if (!isNaN(typeCoutID)) {
        this.textButton = 'Modifier le cout'
        this.titreForm = 'Modification du cout'
        this.typeCoutService.getTypeCoutById(typeCoutID).subscribe(data => {
          data = {
            id: data.id,
            type: data.type,
            categorie: data.categorie,
            EntrepriseId: data.EntrepriseId
          }
          this.myFormGroup.patchValue(data);
        });
      }
    })

  }

}
