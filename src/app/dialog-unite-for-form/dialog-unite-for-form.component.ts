import {Component, Inject, OnInit} from '@angular/core';
import {UniteForFormService} from "../_service/uniteForForm.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {UserService} from "../_service/user.service";
import {UniteForForm} from "../_models/uniteForForm";

@Component({
  selector: 'app-dialog-unite-for-form',
  templateUrl: './dialog-unite-for-form.component.html',
  styleUrls: ['./dialog-unite-for-form.component.scss']
})
export class DialogUniteForFormComponent implements OnInit {

  uniteForForm! : FormGroup;
  user = this.userService.userValue.id;
  entrepriseId!: number;
  unitelist: UniteForForm[]=[];
  selectedUnite!:[]

  constructor(private uniteForFormService:UniteForFormService,
              private form:FormBuilder,
              private userService: UserService,
              public dialogRef: MatDialogRef<DialogUniteForFormComponent>,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,) {

    this.uniteForForm= new FormGroup({
      name: new FormControl('', Validators.required),
      EntrepriseId: new FormControl('', Validators.required)

    })


  }

  ngOnInit(): void {
    this.getId()
    this.getAll()


  }

getId(): void {
  this.userService.getById(this.user).subscribe(data=>{
    this.entrepriseId=data.Entreprises[0].id
    this.uniteForForm.controls['EntrepriseId'].setValue(this.entrepriseId);
    console.log(this.entrepriseId)
  })
}

  create(): void {
    const formData = this.uniteForForm.getRawValue();
    console.log(formData)
    this.uniteForFormService.create(formData).subscribe(()=>{
      this.toastr.success("Création réussie", "Les données sont enregistrer")
      this.dialogRef.close()
    })
  }

  getAll(): void {
    this.uniteForFormService.getAll().subscribe(data=>{
      this.unitelist=data

    })
  }
  delete(): void {
    for (let i = 0; i < this.selectedUnite.length; i++) {
      this.uniteForFormService.delete(this.selectedUnite[i]).subscribe(data => {
        this.toastr.warning("Suppression réussie", "Les données sont effacer")
      }, error => {
        this.toastr.error("Suppression  échouée", "un problemes a éte renconter")
        console.log('Erreur lors de la suppression de l\'unité');
      });
    }
    this.selectedUnite = [];
    this.dialogRef.close()


  }

}
