import {Component, Inject, OnInit} from '@angular/core';
import {UniteForFormService} from "../_service/uniteForForm.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {UserService} from "../_service/user.service";
import {UniteForForm} from "../_models/uniteForForm";
import {TypeCoutService} from "../_service/typeCout.service";
import {TypeCout} from "../_models/type-cout";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Entreprise} from "../_models/entreprise";

@Component({
  selector: 'app-dialog-unite-for-form',
  templateUrl: './dialog-unite-for-form.component.html',
  styleUrls: ['./dialog-unite-for-form.component.scss']
})
export class DialogUniteForFormComponent implements OnInit {

  uniteForForm! : FormGroup;
  user = this.userService.userValue.id;
  entrepriseId!: number;
  unitelist: any[]=[];
  selectedUnite!:[]
  typeCout:any[]=[]
  categories:any[]=[]
  uniteListTypeCategorie!: any[];
  listEntreprise : Entreprise [] = []
  constructor(private uniteForFormService:UniteForFormService,
              private typeCoutService: TypeCoutService,
              private form:FormBuilder,
              private userService: UserService,
              public dialogRef: MatDialogRef<DialogUniteForFormComponent>,
              public dataSharingService: DataSharingService,

              @Inject(TOASTR_TOKEN) private toastr: Toastr,) {

    this.uniteForForm = new FormGroup({
      name: new FormControl('', Validators.required),
      EntrepriseId: new FormControl('', Validators.required),
      TypeCoutId: new FormControl('', Validators.required),
    })



  }

  ngOnInit(): void {
    this.getId()
    this.getAll()


  }

getId(): void {
  this.userService.getById(this.user).subscribe(data=>{
    data.Entreprises.forEach((entreprise: Entreprise) =>{
      this.listEntreprise.push(entreprise)
    })
    // this.entrepriseId=data.Entreprises[0].id
    // this.uniteForForm.controls['EntrepriseId'].setValue(this.entrepriseId);
    // console.log(this.entrepriseId)
    // this.getAllTypeCouts(this.entrepriseId)
    // this.typeCoutService.getAllTypeCouts(this.entrepriseId).subscribe(data => {
    //   this.type = data.map(item => item.type);
    //   this.categorie = data.map(item => item.categorie);
    //   console.log(this.type, this.categorie);
    // });
  })

}
getEntreprise(){
    // this.uniteForForm.controls['EntrepriseId'].setValue(2)
  console.log('form', this.uniteForForm.getRawValue())
  this.getAllTypeCouts(this.uniteForForm.controls['EntrepriseId'].value)
  console.log("unite for form controle entreprise ",this.uniteForForm.controls['EntrepriseId'].value)

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
  //Recupere tous les type de couts pour implementer le select picker du template
  getAllTypeCouts(entrepriseID: number): void {
    console.log('entreprise get all tyupe couts' , entrepriseID)
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(data => {
        this.typeCout = data;
        console.log('type cout',this.typeCout)

      }
    )
  }

  getUnitesByTypeCoutId(id:number){
    this.uniteForFormService.getUniteByType(id).subscribe(data=>{
      this.uniteListTypeCategorie=data
      console.log(this.uniteListTypeCategorie)

    })
  }
  getCategorieByType(type: string): void {
    this.typeCoutService.getCategorieByType(type).subscribe(data => {
      this.categories = data;

      console.log("categorie",this.categories);
    });
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
