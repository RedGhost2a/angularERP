import {Component, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";
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

@Component({
  selector: 'app-sous-detail-prix',
  templateUrl: './sous-detail-prix.component.html',
  styleUrls: ['./sous-detail-prix.component.scss']
})
export class SousDetailPrixComponent implements OnInit {
  ouvrageID!: number;
  currentOuvrage !: Ouvrage;
  columnsToDisplay = ["type"
    , "categorie", "designation", "unite", "uRatio", "ratio", "efficience", "quantite", "prixUnitaireHT",
    "DSTotal", "PUHTEquilibre", "prixHTEquilibre",
    "PUHTCalcule",
    "prixHTCalcule", "boutons"];
  coefEqui: number = 35.79;

  totalDBS = {
    prixOuvrage: 0
  };

  currentUser !: User
  listCout !: Cout[]
  listFournisseur!: Fournisseur[]
  listTypeCout!: TypeCout []

  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              public dataShared: DataSharingService, private coutService: CoutService, private userService: UserService,
              public dialog: MatDialog, private sousLotOuvrageService: SousLotOuvrageService,private fournisseurService : FournisseurService,
              private typeCoutService : TypeCoutService, private ouvrageCoutService : OuvrageCoutService
  ) {
  }

  ngOnInit(): void {
    console.log("debut ngOninit")
    this.route.params.subscribe(async params => {
      this.ouvrageID = +params['id'];
      await this.ouvrageService.getOuvrageDuDevisById(this.ouvrageID).subscribe(async data => {
        console.log("this currentOuvrage ", data)
        this.currentOuvrage = data;
        this.dataShared.ouvrage = data;
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

  getCurrentUser(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(
      data => {
        this.currentUser = data
        this.dataShared.entrepriseId = data.Entreprises[0].id;
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
       await this.dataShared.prixUnitaireHT(this.currentOuvrage.SousLotOuvrage)
    }
  }
  prixVenteHT(){
    if (this.currentOuvrage.SousLotOuvrage !== undefined) {
    this.dataShared.prixVenteHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixEquilibreHT(): void {
    // console.log("ouvrage", this.currentOuvrage)
    if (this.currentOuvrage.SousLotOuvrage) {
      // console.log("prixEquilibreHT")
      this.dataShared.prixEquilibreHT(this.currentOuvrage.SousLotOuvrage)
    }
  }

  prixUnitaireEquilibreHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataShared.prixUnitaireEquilibre(this.currentOuvrage.SousLotOuvrage)
    }
  }

  beneficePercentToEuro(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataShared.beneficePercentToEuro(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.benefice)
  }

  aleasPercentToEuro(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataShared.aleasPercentToEuro(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.aleas)
  }

  prixCalculeHT(): void {
    if (this.currentOuvrage.SousLotOuvrage)
      this.dataShared.prixCalculeHT(this.currentOuvrage.SousLotOuvrage, this.currentOuvrage.benefice, this.currentOuvrage.aleas)
  }

  prixUnitaireCalculeHT(): void {
    if (this.currentOuvrage.SousLotOuvrage) {
      this.dataShared.prixUnitaireCalculeHT(this.currentOuvrage.SousLotOuvrage)
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
      this.dataShared.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)
      if (this.currentOuvrage.SousLotOuvrage?.id){
        this.sousLotOuvrageService.updatedPrice(this.currentOuvrage.SousLotOuvrage.id, this.totalDBS).subscribe((res)=>{
          console.log("response",res)
        })
      }
    }
    if(this.currentOuvrage.prix !== 0 && this.currentOuvrage.SousLotOuvrage && !this.currentOuvrage.CoutDuDevis?.length){
      this.totalDBS.prixOuvrage = this.currentOuvrage.prix * this.currentOuvrage.SousLotOuvrage.quantityOuvrage
      this.dataShared.SetPrixOuvrage(this.totalDBS, this.currentOuvrage.SousLotOuvrage)

    }
  }

  prixEquilibreHTCout(): void {
    if (this.currentOuvrage.CoutDuDevis) {
      this.currentOuvrage.CoutDuDevis.forEach(coutDuDevis => {
        if (coutDuDevis.debourseSecTotal)
          coutDuDevis.prixEquiHT = coutDuDevis.debourseSecTotal * this.dataShared.coefEqui
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

}
