import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CoutService} from "../_service/cout.service";
import {ActivatedRoute} from '@angular/router';
import {UserService} from "../_service/user.service"
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurCout} from "../_models/fournisseur-cout";
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  userId = localStorage.getItem("userID");
  myFormGroup!: FormGroup;
  fournisseur!: Fournisseur[];
  typeCout !: TypeCout[];
  fournisseurCout!:FournisseurCout;
  textButton!: string;
  titreForm!: string;
  lastCoutId!: number;
  fournisseurId!:number;
  urlCout: string = "http://localhost:4200/cout";
  urlFournisseur: string =  "http://localhost:4200/fournisseur";
  urlTypeCout :string = "http://localhost:4200/typeCout";
  isCout:boolean = false;
  isFournisseur:boolean = false;
  isTypeCout:boolean = false;

  constructor(private formBuilder: FormBuilder, private coutService: CoutService,
              private route: ActivatedRoute, private userService: UserService,
              private fournisseurService : FournisseurService, private typeCoutService: TypeCoutService) { }

  ngOnInit(): void {
    const regexCout = new RegExp(`^${this.urlCout}`)
    const regexFournisseur = new RegExp(`^${this.urlFournisseur}`)
    const regexTypeCout = new RegExp(`^${this.urlTypeCout}`)
    if(regexCout.test(window.location.href)){
      this.createFormCout();
      this.getUserById();
      //this.getAllTypeCouts();
      this.generateFormUpdateCout();
      this.getAllFournisseur()
      this.isCout = true;
      console.log(this.isCout)
    }if(regexFournisseur.test(window.location.href)){
      this.createFormFournisseur()
      this.generateFormUpdateFournisseur()
      this.isFournisseur = true;
    }if(regexTypeCout.test(window.location.href)){
      this.createFormTypeCout();
      this.getUserById();
      this.generateFormUpdateTypeCout();
      this.isTypeCout = true;
    }
  }

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////COUT//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  createAndUpdateCout(): void {
    this.route.params.subscribe(params => {
      const coutID = +params['id']
      if (isNaN(coutID)) {
        this.coutService.create(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            this.fournisseurId = this.myFormGroup.getRawValue().Fournisseurs
            alert('Nouveau cout enregistrer')
            this.getLastCout()
            this.createCoutFournisseur(this.lastCoutId,this.fournisseurId)
          });
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
    this.textButton = "Creer un cout";
    this.titreForm = "Création d'un cout"
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
  generateFormUpdateCout(): void {
    console.log("generateFormUpdateCout")
    this.route.params.subscribe(params => {
      console.log(params)
      const coutID = +params['id']
      console.log(coutID)
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////FOURNISSEUR//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  createFormFournisseur():void{
    this.textButton = "Creer un fournisseur";
    this.titreForm = "Création d'un fournisseur"
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      commercialName: new FormControl(),
      remarque: new FormControl(),
    });
  }
  createAndUpdateFournisseur(): void {
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


  generateFormUpdateFournisseur(): void {
    this.route.params.subscribe(params => {
      const fournisseurID = +params['id']
      if (!isNaN(fournisseurID)) {
        this.textButton = 'Modifier le fournisseur'
        this.titreForm = 'Modification du fournisseur'
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////TYPECOUT//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  createFormTypeCout():void{
    this.textButton = "Creer un type de cout";
    this.titreForm = "Création d'un type de cout"
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      type: new FormControl(),
      categorie: new FormControl(),
      EntrepriseId: new FormControl(),
    });
  }
  createAndUpdateTypeCout(): void {
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
            alert('type de cout modifier')
          });
      }
    })
  }


  generateFormUpdateTypeCout(): void {
    this.route.params.subscribe(params => {
      const typeCoutID = +params['id']
      if (!isNaN(typeCoutID)) {
        this.textButton = 'Modifier le type de cout'
        this.titreForm = 'Modification du type de cout'
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
