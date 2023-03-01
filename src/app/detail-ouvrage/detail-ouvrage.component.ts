import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Ouvrage} from "../_models/ouvrage";
import {ActivatedRoute} from "@angular/router";
import {Cout} from "../_models/cout";
import {OuvrageCout} from "../_models/ouvrageCout";
import {FormControl, FormGroup} from "@angular/forms";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {FormCoutComponent} from "../form-cout/form-cout.component";
import {CoutService} from "../_service/cout.service";
import {DialogListCoutComponent} from "../dialog-list-cout/dialog-list-cout.component";
import {OuvrageAddCoutComponent} from "../ouvrage-add-cout/ouvrage-add-cout.component";

@Component({
  selector: 'app-detail-ouvrage',
  templateUrl: './detail-ouvrage.component.html',
  styleUrls: ['./detail-ouvrage.component.scss']
})
export class DetailOuvrageComponent implements OnInit {
  ouvrage!: Ouvrage
  ouvrageCout!: OuvrageCout
  ouvrageID!: number
  // cout!:Cout[];
  listCout!: Cout[]
  @Output() deleteCout: EventEmitter<any> = new EventEmitter()
  columnsToDisplay = ["designation", "benefice", "aleas", "unite", "ratio", "uRatio", "prixUnitaire", "boutons"];
  myFormGroup!: FormGroup;
  formOuvrage!: FormGroup;
  columnsToDisplayCout = ["type", "categorie", "designation", "ratio", "uRatio", "unite", "prixUnitaire", "fournisseur", "boutons"];


  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageCoutService: OuvrageCoutService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getById();
    // this.getPriceOuvrage()

    // this.formGroupOuvrage()
    // this.getOuvragePriceById(this.ouvrageID)
  }

  formGroupOuvrage(data: any): void {
    this.formOuvrage = new FormGroup({
      designation: new FormControl(data.designation),
      benefice: new FormControl(data.benefice),
      aleas: new FormControl(data.aleas),
      unite: new FormControl(data.unite),
      ratio: new FormControl(data.ratio),
      uRatio: new FormControl(data.uRatio),
      prix: new FormControl({value: data.prix, disabled: true})
    })
  }

  formRatioOuvrageCout(): void {
    this.myFormGroup = new FormGroup({
      ratioCout: new FormControl("")
    })
  }

  getById(): void {
    this.route.params.subscribe(params => {
      this.ouvrageID = +params['id'];
      this.ouvrageService.getById(this.ouvrageID).subscribe(data => {
        this.ouvrage = data;
        console.log(data)
        // data.Couts.forEach((cout:Cout)=>{
        //   if(cout.OuvrageCout)
        this.uRatioUpdate(this.ouvrage)
        // })
        this.getPriceOuvrage()
        this.formGroupOuvrage(data)
        this.formRatioOuvrageCout()
        this.getAllCout(data.EntrepriseId)
        // this.ouvrage.fournisseur = data.Couts[0].Fournisseurs[0].commercialName
        // console.log("FOURNISSEUR",this.ouvrage.fournisseur)
      })
    })
  }


  updateOuvrageOnChange() {
    console.log("test")
    this.ouvrageService.update(this.formOuvrage.getRawValue(), this.ouvrageID).subscribe(() => {
        this.getById()
      }
    )
  }

  getPriceOuvrage(): void {
    this.ouvrage.prix = 0;
    this.ouvrage.Couts?.forEach(cout => {
      this.ouvrage.prix += cout.prixUnitaire;
    })
    console.log('PRIX DE L OUVRAGE', this.ouvrage.prix)
  }


  uRatioUpdate(ouvrage: Ouvrage): void {
    // ouvrageCout.uRatio = "";
    ouvrage.Couts?.forEach(cout => {
      if (cout.OuvrageCout) {
        cout.OuvrageCout.uRatio = `${cout.unite}/${ouvrage.unite}`
        console.log(`${cout.unite}/${ouvrage.unite}`)
        this.ouvrageCoutService.updateOuvrageCout(cout.id, ouvrage.id, cout.OuvrageCout).subscribe()
      }
    })
    // ouvrageCout.uRatio = `${cout.unite}/${ouvrage.unite}`

    // return `${cout.unite}/${ouvrage.unite}`
  }

  ratioChange(cout: Cout) {
    this.ouvrageCout = {
      OuvrageId: this.ouvrageID,
      CoutId: cout.id,
      ratio: +this.myFormGroup.getRawValue().ratioCout,
      uRatio: cout.OuvrageCout?.uRatio
    }
    this.ouvrageCoutService.updateOuvrageCout(cout.id, this.ouvrageID, this.ouvrageCout).subscribe(() => {
      this.getById()
    })
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  openDialogCreate(cout: Cout | null) {
    this.dialog.open(FormCoutComponent, {
      data: cout,
      width: '70%',
      height: '40%'
    }).afterClosed().subscribe(async result => {
      this.getById()
      console.log("result ? list cout: ", result)


    });
  }

  openDialogImport() {
    this.dialog.open(OuvrageAddCoutComponent, {
      panelClass:"test",
      data: this.ouvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      console.log("result", result)
      // this.uRatio(this.ouvrage,)
      this.getById()

    });
  }

  getAllCout(entrepriseID: number): void {
    this.coutService.getAll(entrepriseID).subscribe(
      data => {
        this.listCout = data
      }
    )
  }

}
