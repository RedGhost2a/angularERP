import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CoutService} from "../_service/cout.service";
import {ActivatedRoute} from '@angular/router';
import {UserService} from "../_service/user.service"
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";


interface FournisseurCout{
  CoutId:number;
  Fournisseurid: number;
}

@Component({
  selector: 'app-form-cout',
  templateUrl: './form-cout.component.html',
  styleUrls: ['./form-cout.component.scss']
})
export class FormCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  textButton: string = "Creer un nouveau cout";
  titreForm: string = "Création d'un du cout";
  typeCout !: TypeCout[];
  fournisseur!: Fournisseur[];
  userId = localStorage.getItem("userID");
  lastCoutId!: number;
  fournisseurId!:number;
  fournisseurCout!:FournisseurCout;


  constructor(private formBuilder: FormBuilder, private coutService: CoutService,
              private route: ActivatedRoute, private userService: UserService,
              private fournisseurService : FournisseurService, private typeCoutService: TypeCoutService) {}


  ngOnInit(): void {
    this.createFormCout();
    this.getUserById();
    //this.getAllTypeCouts();
    this.generateFormUpdate();
    this.getAllFournisseur()
  }

  //Determine si c'est l'ajout d'un nouveau cout ou la modification d'un cout existant au click
  createAndUpdate(): void {
    this.route.params.subscribe(params => {
      const coutID = +params['id']
      if (isNaN(coutID)) {
        this.coutService.create(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
           this.fournisseurId = this.myFormGroup.getRawValue().Fournisseurs
            alert('Nouveau cout enregistrer')
             this.getLastCout()
              this.createCoutFournisseur(this.lastCoutId,this.fournisseurId)
             //this.createCoutFournisseur(this.lastCoutId,this.fournisseurId)

          }
        );

      } else {
        this.coutService.update(this.myFormGroup.getRawValue(), coutID)
          .subscribe((data): void => {
            this.fournisseurCout = this.myFormGroup.getRawValue().Fournisseurs;
            console.log("this.fournisseur[0]",this.fournisseur[0])
            alert('Update!')
          });
      }
    })
  }

  //Recupere l'id de l'entreprise de l'utilisateur courant, et creer le formulaire
  getUserById(): void {
    this.userService.getById(this.userId).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id),
        this.getAllTypeCouts(data.Entreprises[0].id)

    })
  }

  createFormCout():void{
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl(),
      unite: new FormControl(),
      prixUnitaire: new FormControl(),
      EntrepriseId: new FormControl(),
      TypeCoutId: new FormControl(),
      Fournisseurs: new FormControl()
    });
  }


//Recupere tous les type de couts pour implementer le select picker du template
  getAllTypeCouts(entrepriseID:number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(data =>{
      this.typeCout = data;

    }
    )
    // this.coutService.getAllTypeCout().subscribe(data => {
    //   this.typeCout = data;
      //this.typeCout = Array.from(this.typeCout.reduce((m, t) => m.set(t.type, t), new Map()).values());
    // })
  }
  //Recupere tous les fournisseurs pour implementer le select picker du template
  getAllFournisseur(): void {
    this.fournisseurService.getAllFournisseurs().subscribe(data => {
      this.fournisseur = data;
      //this.typeCout = Array.from(this.typeCout.reduce((m, t) => m.set(t.type, t), new Map()).values());
    })
  }

  //Genere le formulaire de modification avec la data du cout selectionnner, change le titre du formulaire
  //et le texte du bouton de validation
  generateFormUpdate(): void {
    this.route.params.subscribe(params => {
      const coutID = +params['id']
      if (!isNaN(coutID)) {
        this.textButton = 'Modifier le cout'
        this.titreForm = 'Modification du cout'
        this.coutService.getById(coutID).subscribe(data => {
           const {Fournisseurs}:any = data;
          data = {
            id: data.id,
            designation: data.designation,
            unite: data.unite,
            prixUnitaire: data.prixUnitaire,
            EntrepriseId: data.EntrepriseId,
            TypeCoutId: data.TypeCoutId,
            Fournisseurs: Fournisseurs[0].id
          }
          this.myFormGroup.patchValue(data);
        });
      }
    })

  }

  getLastCout():void{
    this.coutService.getLast().subscribe(data=>{
      console.log("LAST COUT",data)
      this.lastCoutId = data[0].id
      console.log("TEST", this.lastCoutId)
      this.createCoutFournisseur(this.lastCoutId, this.fournisseurId)
    })
  }

   createCoutFournisseur(LastCoutId:number,FournisseurId:number){
     this.fournisseurService.createFournisseurCout(LastCoutId,FournisseurId ).subscribe()
  }
  updateCoutFournisseur(CoutId:number, FournisseurId:number, data:FournisseurCout):void{
    this.fournisseurService.updateFournisseurCout(CoutId,FournisseurId,data).subscribe()
  }
}

