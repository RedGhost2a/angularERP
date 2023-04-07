import {Component, Inject, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Ouvrage} from "../_models/ouvrage";
import {DialogListCoutComponent} from "../dialog-list-cout/dialog-list-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {CoutService} from "../_service/cout.service";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {Cout} from "../_models/cout";
import {SousLotOuvrageService} from "../_service/sous-lot-ouvrage.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {FournisseurService} from "../_service/fournisseur.service";
import {TypeCoutService} from "../_service/typeCout.service";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {FormCoutComponent} from "../form-cout/form-cout.component";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import{transformVirguletoPoint} from "../_helpers/transformVirguletoPoint";
import {UniteForForm} from "../_models/uniteForForm";
import {OuvrageCout} from "../_models/ouvrageCout";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {UniteForFormService} from "../_service/uniteForForm.service";
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-sous-detail-prix',
  templateUrl: './sous-detail-prix.component.html',
  styleUrls: ['./sous-detail-prix.component.scss']
})
export class SousDetailPrixComponent implements OnInit {
  ouvrageID!: number;
  currentOuvrage !: Ouvrage;
  isFormVisible = false;

  columnsToDisplay = [
    "type",
    "categorie",
    "designation",
    "unite",
    "uRatio",
    "ratio",
    "efficience",
    "quantite", "prixUnitaireHT",
    "DSTotal", "PUHTEquilibre", "prixHTEquilibre",
    "PUHTCalcule",
    "prixHTCalcule", "boutons"];
  coefEqui: number = 35.79;

  totalDBS = {
    prixOuvrage: 0
  };
  myFormGroup!: FormGroup;
  coutDuDevis!: CoutDuDevis
  cout!: Cout;
  isChecked: boolean = false;
  isInDevis: boolean = true;
  categories: any[] = [];
  typeCout !: TypeCout[];
  uniteList!:UniteForForm[];

  currentUser !: User
  listCout !: Cout[]
  listFournisseur!: Fournisseur[]
  listTypeCout!: TypeCout []
  formCout!: FormGroup;
  formOuvrage!: FormGroup;
  ouvrageCoutDuDevis!: OuvrageCoutDuDevis
  textButtonBack : string = "Retour au devis";

  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              public dataSharingService: DataSharingService, private coutService: CoutService, private userService: UserService,
              public dialog: MatDialog, private sousLotOuvrageService: SousLotOuvrageService, private fournisseurService : FournisseurService,
              private typeCoutService : TypeCoutService, private ouvrageCoutService : OuvrageCoutService,
              private router : Router, private uniteForFormService : UniteForFormService, @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {
    transformVirguletoPoint()
    this.createFormCout2()
    this.createFormCout();
    this.createFormOuvrage()

  }

  ngOnInit(): void {
    this.createFormCout();
    this.createFormOuvrage()
    console.log("debut ngOninit")
    this.route.params.subscribe(async params => {
      this.ouvrageID = +params['id'];
      await this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe(async data => {
        console.log("this currentOuvrage ", data)
        this.currentOuvrage = data;
        this.dataSharingService.ouvrage = data;
        // this.dataShared.ouvrage.SousLotOuvrage?.prixOuvrage = 10;
        console.log(this.currentOuvrage)
        if(this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage ){
          // this.dataShared.ouvrage.SousLotOuvrage?.prixOuvrage = this.currentOuvrage.prix
        }
        if (data.SousLots) {
          this.currentOuvrage.SousLotOuvrage = data.SousLots[0].SousLotOuvrage
        }
        await this.debousesSecTotalCout()
        this.getCurrentUser()
        await this.prixUnitaireHT()
        this.prixEquilibreHT()
        this.prixUnitaireEquilibreHT()
        this.beneficePercentToEuro()
        this.aleasPercentToEuro()
        this.prixCalculeHT()
        this.prixUnitaireCalculeHT()
        this.quantityCout()
        this.prixEquilibreHTCout()
        this.prixUnitaireEquilibreHTCout()
        this.prixCalculeHTCout()
        this.prixUnitaireCalculeHTCout()
        this.prixVenteHT()

        console.log("ngOninit", data)

      })
    })
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    //reinitialiser le formulaire





  }


  changeTextButton(){
    if(localStorage.getItem('index') === "0"){
      this.textButtonBack = "Retour au frais de chantier"
    }
  }


  ratioChange(coutDuDevis: CoutDuDevis) {
    console.log(this.formCout.getRawValue().ratio)
    if(this.formCout.getRawValue().ratio !== null){

    this.ouvrageCoutDuDevis = {
      OuvrageDuDeviId: this.currentOuvrage.id,
      CoutDuDeviId: coutDuDevis.id,
      ratio: +this.formCout.getRawValue().ratio
    }
    if(coutDuDevis.id)
    this.ouvrageCoutService.updateOuvrageCoutDuDevis(coutDuDevis?.id,  this.currentOuvrage.id, this.ouvrageCoutDuDevis).subscribe(() => {
      // this.getById()
      this.ngOnInit()
    })
    }
  }
  efficienceChange(coutDuDevis: CoutDuDevis) {
    console.log("efficience",this.formCout.getRawValue().efficience)
    if(this.formCout.getRawValue().efficience !== null){

      this.ouvrageCoutDuDevis = {
        OuvrageDuDeviId: this.currentOuvrage.id,
        CoutDuDeviId: coutDuDevis.id,
        efficience: +this.formCout.getRawValue().efficience,
      }
      if(coutDuDevis.id)
        this.ouvrageCoutService.updateOuvrageCoutDuDevis(coutDuDevis?.id,  this.currentOuvrage.id, this.ouvrageCoutDuDevis).subscribe(() => {
          // this.getById()
          this.ngOnInit()
        })
    }
  }


  ratioOuvrageChange() {
    console.log(this.formOuvrage.getRawValue().ratioOuvrage)
    if(this.formOuvrage.getRawValue().ratioOuvrage !== null){
        this.ouvrageService.updateOuvrageDuDevis({ratio:this.formOuvrage.getRawValue().ratioOuvrage},this.currentOuvrage.id).subscribe(() => {
          // this.getById()
          this.ngOnInit()
        })
    }
  }
  beneficeChange() {
    console.log(this.formOuvrage.getRawValue().benefice)
    if(this.formOuvrage.getRawValue().benefice !== null){
      this.ouvrageService.updateOuvrageDuDevis({benefice:this.formOuvrage.getRawValue().benefice},this.currentOuvrage.id).subscribe(() => {
        // this.getById()
        this.ngOnInit()
      })
    }
  }

  quantityChange() {
    console.log(this.formOuvrage.getRawValue().quantity)
    if (this.formOuvrage.getRawValue().quantity !== null && this.currentOuvrage.SousLotOuvrage && this.currentOuvrage?.SousLotOuvrage.id) {
      this.currentOuvrage.SousLotOuvrage!.quantityOuvrage = this.formOuvrage.getRawValue().quantity
      this.sousLotOuvrageService.update(this.currentOuvrage.SousLotOuvrage.id, this.currentOuvrage.SousLotOuvrage).subscribe(() => {
        this.ngOnInit()
      })
    }
  }

  aleasChange() {
    console.log(this.formOuvrage.getRawValue().aleas)
    if(this.formOuvrage.getRawValue().aleas !== null){
      this.ouvrageService.updateOuvrageDuDevis({aleas:this.formOuvrage.getRawValue().aleas},this.currentOuvrage.id).subscribe(() => {
        // this.getById()
        this.ngOnInit()
      })
    }
  }


  createFormCout(){
    this.formCout = new FormGroup({
      ratio: new FormControl(),
      efficience: new FormControl()
    })
  }
  createFormOuvrage(){
    this.formOuvrage = new FormGroup({
      ratioOuvrage: new FormControl(),
      benefice: new FormControl(),
      aleas: new FormControl(),
      quantity: new FormControl()
    })
  }
  getCurrentUser(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(
      data => {
        this.currentUser = data
        this.dataSharingService.entrepriseId = data.Entreprises[0].id;
        this.getUniteByEnteprise( this.dataSharingService.entrepriseId)

        this.getAllCout(data.Entreprises[0].id)
        this.getAllFournisseurs(data.Entreprises[0].id)
        this.getAllTypeCouts(data.Entreprises[0].id)
      }
    )
  }


  getAllCout(entrepriseID: number): void {
    this.coutService.getAll(entrepriseID).subscribe(
      data => {
        this.listCout = data
        console.log("list cout",data)
      }
    )
  }
  getAllFournisseurs(entrepriseID:number):void {
    this.fournisseurService.getAllFournisseurs(entrepriseID).subscribe(fournisseurs =>{
      console.log("liste des fournisseurs: ", fournisseurs)
      this.listFournisseur = fournisseurs;
    })
  }
  getAllTypeCouts(entrepriseID: number):void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(typeCouts =>{
      console.log("liste des type de couts : ", typeCouts)
      this.listTypeCout = typeCouts;
    })
  }


   async prixUnitaireHT() {
    if (this.currentOuvrage.SousLotOuvrage !== undefined) {
       await this.dataSharingService.prixUnitaireHT(this.currentOuvrage.SousLotOuvrage)
    }
  }
  prixVenteHT(){
    if (this.currentOuvrage.SousLotOuvrage !== undefined) {
    this.dataSharingService.prixVenteHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixEquilibreHT(): void {
    // console.log("ouvrage", this.currentOuvrage)
    if (this.currentOuvrage.SousLotOuvrage) {
      // console.log("prixEquilibreHT")
      this.dataSharingService.prixEquilibreHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixUnitaireEquilibreHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataSharingService.prixUnitaireEquilibre(this.currentOuvrage.SousLotOuvrage)
    }
  }

  beneficePercentToEuro(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.beneficePercentToEuro(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.benefice)
  }

  aleasPercentToEuro(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.aleasPercentToEuro(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.aleas)
  }

  prixCalculeHT(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.prixCalculeHT(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.benefice, this.currentOuvrage.aleas)
  }

  prixUnitaireCalculeHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataSharingService.prixUnitaireCalculeHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  quantityCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.quantite = coutDuDevis.OuvrageCoutDuDevis?.ratio * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }

  async debousesSecTotalCout() {
    this.totalDBS.prixOuvrage = 0;
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach( coutDuDevis  => {
        if (coutDuDevis.OuvrageCoutDuDevis?.ratio && this.currentOuvrage.SousLotOuvrage) {
          coutDuDevis.debourseSecTotal = coutDuDevis.prixUnitaire * (coutDuDevis.OuvrageCoutDuDevis?.ratio * this.currentOuvrage.SousLotOuvrage?.quantityOuvrage)
          this.totalDBS.prixOuvrage += coutDuDevis.debourseSecTotal
          console.log(this.totalDBS)
        }
      })
          console.log("TOTAL",this.totalDBS)
      if(this.currentOuvrage.SousLotOuvrage)
      this.dataSharingService.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)
      if (this.currentOuvrage.SousLotOuvrage?.id){
        this.sousLotOuvrageService.updatedPrice(this.currentOuvrage.SousLotOuvrage.id, this.totalDBS).subscribe((res)=>{
          console.log("response",res)
        })
      }
    }
    if(this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage && !this.currentOuvrage.CoutDuDevis?.length){
      this.totalDBS.prixOuvrage = this.currentOuvrage.prix * this.currentOuvrage.SousLotOuvrage.quantityOuvrage
      this.dataSharingService.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)

    }
  }

  prixEquilibreHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.debourseSecTotal)
          coutDuDevis.prixEquiHT = coutDuDevis.debourseSecTotal * this.dataSharingService.coefEqui
      })
    }
  }

  prixUnitaireEquilibreHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixEquiHT && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.prixUnitaireEquiHT = coutDuDevis.prixEquiHT / this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }

  prixCalculeHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixEquiHT)
          coutDuDevis.prixCalcHT = coutDuDevis.prixEquiHT * (1 + (this.currentOuvrage.benefice / 100) + (this.currentOuvrage.aleas / 100))
      })
    }
  }

  prixUnitaireCalculeHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.prixCalcHT && this.currentOuvrage.SousLotOuvrage)
          coutDuDevis.prixUnitaireCalcHT = coutDuDevis.prixCalcHT / this.currentOuvrage.SousLotOuvrage?.quantityOuvrage
      })
    }
  }


  openDialogImport(ouvragDuDevisId: number) {
    this.dialog.open(DialogListCoutComponent, {
      panelClass:'test',
      data: this.listCout,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      if (result) {
        console.log("result ? list cout: ", result)
        this.ngOnInit()
      } else {
        console.log("afterClose else")
      }
      console.log("console")

    });
  }

  openDialogCreate(ouvragDuDevisId: number) {
    this.dialog.open(DialogFormCoutComponent, {
      data: [ this.listTypeCout, this.listFournisseur],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
        this.ngOnInit()

    });
  }

  openDialogUpdateCout(coutDuDevis: CoutDuDevis) {
    this.dialog.open(FormCoutComponent, {
      data: coutDuDevis,
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }



  deleteItem(coutDuDeviId: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.coutService.deleteCoutDuDevisByID(coutDuDeviId).subscribe(() => this.ngOnInit())

        // this.ouvrageCoutService.deleteCoutAndOuvrageDuDevis(coutDuDeviId, this.currentOuvrage.id).subscribe(() => this.ngOnInit())
      }
    });
  }

  createFormCout2(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl('',Validators.required),
      unite: new FormControl("",Validators.required),
      prixUnitaire: new FormControl("",[Validators.required,]),
      EntrepriseId: new FormControl(""),
      TypeCoutId: new FormControl(""),
      type: new FormControl(""),
      FournisseurId: new FormControl("",Validators.required),
      ratio: new FormControl("",[Validators.required]),
      uRatio: new FormControl(""),
      efficience: new FormControl(1,[Validators.required])
    });
  }

  checked() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked)
  }

  createCoutDuDevis(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.isInDevis) {
      this.myFormGroup.controls["EntrepriseId"].setValue(this.dataSharingService.entrepriseId)
      this.coutDuDevis = this.myFormGroup.getRawValue();
      this.coutDuDevis.fournisseur = this.myFormGroup.getRawValue().FournisseurId[0]
      this.coutDuDevis.remarque !== null ? this.myFormGroup.getRawValue().FournisseurId[1] : ""
      this.coutDuDevis.type = this.myFormGroup.getRawValue().type
      this.coutDuDevis.categorie = this.myFormGroup.getRawValue().TypeCoutId[1]
      console.log(this.myFormGroup.getRawValue())
      this.cout = this.myFormGroup.getRawValue();
      console.log("cout", this.cout)
      this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
      this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[0]


      this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
          this.myFormGroup.markAllAsTouched();
          if (this.myFormGroup.invalid) {
            // Form is invalid, show error message
            this.toastr.error("Le formulaire est invalide.", "Erreur !");
            return;
          }
          const ouvrageCoutDuDevis: OuvrageCoutDuDevis = {
            OuvrageDuDeviId: this.dataSharingService.ouvrage.id,
            CoutDuDeviId: responseCout?.id,
            ratio: this.myFormGroup.getRawValue().ratio,
            uRatio: this.myFormGroup.getRawValue().uRatio,
          }
          this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCoutDuDevis).subscribe()
          this.myFormGroup.reset();
          this.ngOnInit()

        }
      )
      if (this.isChecked === false) {
        this.coutService.create(this.cout).subscribe((res: any) => {

          const ouvrageCout: OuvrageCout = {
            OuvrageId: 0,
            CoutId: res.cout.id,
            ratio: this.myFormGroup.getRawValue().ratio,
            uRatio: this.myFormGroup.getRawValue().uRatio,
          }
          this.ouvrageCoutService.createOuvrageCoutByDesignation(this.dataSharingService.ouvrage.id, ouvrageCout).subscribe()
          this.myFormGroup.reset();
          this.ngOnInit()
        })

      }
    } else {
      this.myFormGroup.controls["EntrepriseId"].setValue(this.dataSharingService.entrepriseId )
      this.cout = this.myFormGroup.getRawValue();
      this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
      this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[2]

      this.coutService.create(this.cout).subscribe((res: any) => {
        const ouvrageCout: OuvrageCout = {
          OuvrageId:this.ouvrageID,
          CoutId: res.cout.id,
          ratio: this.myFormGroup.getRawValue().ratio,
          uRatio: this.myFormGroup.getRawValue().uRatio,
        }
        console.log("ouvrage cout dans le ELSE",ouvrageCout)
        this.ouvrageCoutService.create(ouvrageCout).subscribe()
        this.myFormGroup.reset();
        this.ngOnInit()
      })
    }

  }

  //Recupere tous les type de couts pour implementer le select picker du template
  getCategorieByType(type: string): void {
    this.typeCoutService.getCategorieByType(type).subscribe(data => {
      this.categories = data;

      console.log(this.categories);
    });
  }
  getUniteByEnteprise(id:number):void {
    this.uniteForFormService.getUniteByEntreprise(id).subscribe(data=>{
      this.uniteList=data
      console.log(this.uniteList)
    })
  }

  setValueURatio(){
    const unite = this.myFormGroup.get('unite')?.value
    this.myFormGroup.controls['uRatio'].setValue(`${unite}/h`)
  }
}
