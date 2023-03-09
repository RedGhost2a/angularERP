import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CoutService} from "../_service/cout.service";
import {ActivatedRoute} from '@angular/router';
import {UserService} from "../_service/user.service"
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurCout} from "../_models/fournisseur-cout";
import {OuvrageService} from "../_service/ouvrage.service";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  userId = this.userService.userValue.id;
  myFormGroup!: FormGroup;
  fournisseur!: Fournisseur[];
  typeCout !: TypeCout[];
  fournisseurCout!: FournisseurCout;
  textButton!: string;
  titreForm!: string;
  lastCoutId!: number;
  fournisseurId!: number;

  urlCout: string = "http://localhost:4200/cout";
  urlFournisseur: string = `${environment.apiUrl}/fournisseur`;
  urlTypeCout: string = `${environment.apiUrl}/typeCout`;
  urlOuvrage: string = "http://localhost:4200/ouvrage";
  isCout: boolean = false;
  isFournisseur: boolean = false;
  isTypeCout: boolean = false;
  isOuvrage: boolean = false;
  entrepriseId!: number;

  constructor(private formBuilder: FormBuilder, private coutService: CoutService,
              private route: ActivatedRoute, private userService: UserService,
              private fournisseurService: FournisseurService, private typeCoutService: TypeCoutService,
              private ouvrageService: OuvrageService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
  ) {
  }

  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  ngOnInit(): void {
    const regexCout = new RegExp(`^${this.urlCout}`)
    const regexFournisseur = new RegExp(`^${this.urlFournisseur}`)
    const regexTypeCout = new RegExp(`^${this.urlTypeCout}`)
    const regexOuvrage = new RegExp(`^${this.urlOuvrage}`)
    if (regexCout.test(window.location.href)) {
      this.createFormCout();
      this.getUserById();
      //this.getAllTypeCouts();
      this.generateFormUpdateCout();

      this.isCout = true;
      console.log(this.isCout)
    }
    if (regexFournisseur.test(window.location.href)) {
      this.createFormFournisseur()
      this.getUserById();
      // this.getAllFournisseur(this.entrepriseId)
      this.generateFormUpdateFournisseur()
      this.isFournisseur = true;
    }
    if (regexTypeCout.test(window.location.href)) {
      this.createFormTypeCout();
      this.getUserById();
      this.generateFormUpdateTypeCout();
      this.isTypeCout = true;
    }
    if (regexOuvrage.test(window.location.href)) {
      this.createFormOuvrage();
      this.getUserById();
      this.generateFormUpdateOuvrage();
      this.isOuvrage = true;
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
            this.fournisseurId = this.myFormGroup.getRawValue().Fournisseur
            this.success("Nouveau composant en vue !")
            // this.getLastCout()
            // this.createCoutFournisseur(this.lastCoutId,this.fournisseurId)
          });
      } else {
        this.coutService.update(this.myFormGroup.getRawValue(), coutID)
          .subscribe((data): void => {
            this.fournisseurCout = this.myFormGroup.getRawValue().Fournisseur;
            console.log("this.fournisseur[0]", this.fournisseur)
            alert('Update!')
          });
      }
    })
  }

  //Recupere l'id de l'entreprise de l'utilisateur courant, et creer le formulaire
  getUserById(): void {
    this.userService.getById(this.userId).subscribe(data => {
      console.log(data)
      this.entrepriseId = data.Entreprises[0].id
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id),
        this.getAllTypeCouts(data.Entreprises[0].id)
      this.getAllFournisseur(data.Entreprises[0].id)
    })
  }

  createFormCout(): void {
    this.textButton = "Creer un cout";
    this.titreForm = "Création d'un cout"
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl(),
      unite: new FormControl(""),
      prixUnitaire: new FormControl(""),
      EntrepriseId: new FormControl(""),
      TypeCoutId: new FormControl(""),
      FournisseurId: new FormControl("")
    });
  }


//Recupere tous les type de couts pour implementer le select picker du template
  getAllTypeCouts(entrepriseID: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(data => {
        this.typeCout = data;
      }
    )
  }

  //Recupere tous les fournisseurs pour implementer le select picker du template
  getAllFournisseur(entrepriseID: number): void {
    console.log("entrepriseID getAllFournisseur", entrepriseID)
    this.fournisseurService.getAllFournisseurs(entrepriseID).subscribe(data => {
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
          // const {Fournisseurs}: any = data;
          data = {
            id: data.id,
            designation: data.designation,
            unite: data.unite,
            prixUnitaire: data.prixUnitaire,
            EntrepriseId: data.EntrepriseId,
            TypeCoutId: data.TypeCoutId,
            // Fournisseurs: Fournisseurs[0].id
            FournisseurId: data.Fournisseur.id
          }
          this.myFormGroup.patchValue(data);
        });
      }
    })

  }

  getLastCout(): void {
    this.coutService.getLast().subscribe(data => {
      console.log("LAST COUT", data)
      this.lastCoutId = data[0].id
      console.log("TEST", this.lastCoutId)
      this.createCoutFournisseur(this.lastCoutId, this.fournisseurId)
    })
  }

  createCoutFournisseur(LastCoutId: number, FournisseurId: number) {
    this.fournisseurService.createFournisseurCout(LastCoutId, FournisseurId).subscribe()
  }

  updateCoutFournisseur(CoutId: number, FournisseurId: number, data: FournisseurCout): void {
    this.fournisseurService.updateFournisseurCout(CoutId, FournisseurId, data).subscribe()
  }

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////FOURNISSEUR//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  createFormFournisseur(): void {
    this.textButton = "Creer un fournisseur";
    this.titreForm = "Création d'un fournisseur"
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      commercialName: new FormControl('', Validators.required),
      remarque: new FormControl(''),
      EntrepriseId: new FormControl(this.entrepriseId),
    });
  }

  createAndUpdateFournisseur(): void {
    this.myFormGroup.markAllAsTouched();
    console.log(this.entrepriseId)
    this.route.params.subscribe(params => {
      const fournisseurID = +params['id']
      if (isNaN(fournisseurID)) {
        this.fournisseurService.createFournisseur(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            console.log(this.myFormGroup.getRawValue())
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
            remarque: data.remarque,
            EntrepriseId: data.EntrepriseId
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
  createFormTypeCout(): void {
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

  ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////OUVRAGE//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  createAndUpdateOuvrage(): void {
    this.route.params.subscribe(params => {
      const ouvrageID = +params['id']
      console.log(this.myFormGroup.getRawValue())
      if (isNaN(ouvrageID)) {
        this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            this.success("Nouvelle ouvrage en vue !")

          }
        )
      } else {
        this.ouvrageService.update(this.myFormGroup.getRawValue(), ouvrageID)
          .subscribe((): void => {
            this.success("Ouvrage modifié !")
          });
      }
    })
  }

  generateFormUpdateOuvrage(): void {
    this.route.params.subscribe(params => {
      const ouvrageID = +params['id']
      if (!isNaN(ouvrageID)) {
        this.textButton = "Modifier l'ouvrage";
        this.titreForm = 'Modification de l ouvrage';
        this.ouvrageService.getById(ouvrageID).subscribe(data => {
          data = {
            designation: data.designation,
            benefice: data.benefice,
            aleas: data.aleas,
            unite: data.unite,
            ratio: data.ratio,
            uRatio: data.uRatio,
          }
          this.myFormGroup.patchValue(data);
        });
      }
    })

  }

  createFormOuvrage(): void {
    this.textButton = "Creer un ouvrage";
    this.titreForm = "Création d'un ouvrage"
    this.myFormGroup = new FormGroup({
      designation: new FormControl(),
      benefice: new FormControl({value: 10, disabled: false}),
      aleas: new FormControl({value: 5, disabled: false}),
      unite: new FormControl(),
      ratio: new FormControl(),
      uRatio: new FormControl(),
      EntrepriseId: new FormControl(),
    });
  }


}
