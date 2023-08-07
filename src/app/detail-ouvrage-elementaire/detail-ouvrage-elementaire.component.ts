import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CoutService} from "../_service/cout.service";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {OuvrageAddCoutComponent} from "../ouvrage-add-cout/ouvrage-add-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {TypeCout} from "../_models/type-cout";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {
  OuvrageElementaireAddCoutComponent
} from "../ouvrage-elementaire-add-cout/ouvrage-elementaire-add-cout.component";
import {Cout} from "../_models/cout";
import {Location} from "@angular/common";
import {filter} from "rxjs/operators";
import {Form, FormControl, FormGroup} from "@angular/forms";
import {OuvrageCout} from "../_models/ouvrageCout";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";
import {Ouvrage} from "../_models/ouvrage";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";

@Component({
  selector: 'app-detail-ouvrage-elementaire',
  templateUrl: './detail-ouvrage-elementaire.component.html',
  styleUrls: ['./detail-ouvrage-elementaire.component.scss']
})
export class DetailOuvrageElementaireComponent implements OnInit {
  listCout!: Cout[]

  ouvrageElementaireID!:number;
  ouvrageElementaire!:OuvrageElementaire;
  listFournisseur !: Fournisseur[]
  listTypeCout !: TypeCout []
  columnsToDisplayCout = ["type", "categorie", "designation", "ratio", "uRatio", "unite", "prixUnitaire","debourseSecTotal", "fournisseur", "boutons"];
  previousUrl!: string;
  myFormGroup!: FormGroup;
  formOuvrageElementaire !: FormGroup

  constructor(private route: ActivatedRoute,
              private coutService: CoutService,
              private ouvrageElementaireService: OuvrageElementaireService, private ouvrageElementaireCoutService : OuvrageElementaireCoutService,
              private dialog: MatDialog, private typeCoutService : TypeCoutService,
              private fournisseurService : FournisseurService,
              private location:Location,
              private router: Router
              ) {
  }
  ngOnInit(): void {


    this.getById()

  }
  formGroupOuvrageElementaire(ouvrageElementaire: OuvrageElementaire): void {
    this.formOuvrageElementaire = new FormGroup({
      designation: new FormControl({value: ouvrageElementaire.designation, disabled: true}),
      unite: new FormControl(ouvrageElementaire.unite),
      remarques: new FormControl(ouvrageElementaire.remarques),
      proportion: new FormControl(ouvrageElementaire.proportion),
      uniteproportionOE: new FormControl(ouvrageElementaire.uniteproportionOE),
      prix: new FormControl({value: ouvrageElementaire.prix, disabled: true})
    })
  }
  formRatioOuvrageElemCout(): void {
    this.myFormGroup = new FormGroup({
      ratioCout: new FormControl("")
    })
  }
  uRatioUpdate(ouvrageElementaire: OuvrageElementaire): void {
    // ouvrageCout.uRatio = "";
    ouvrageElementaire.Couts?.forEach(cout => {
      console.log("cout ouvrage elementaire",cout)
      if (cout.OuvragesElementairesCouts) {
        cout.OuvragesElementairesCouts.uRatio = `${cout.unite}/${ouvrageElementaire.unite}`
        this.ouvrageElementaireCoutService.updateOuvrageElemCout(cout.id, ouvrageElementaire.id, cout.OuvragesElementairesCouts).subscribe()
      }
    })
  }
  getById(): void {
      this.route.params.subscribe(params => {
        this.ouvrageElementaireID = +params['id'];
        this.ouvrageElementaireService.getById(this.ouvrageElementaireID).subscribe(data => {
          this.ouvrageElementaire = data;
          console.log("data",data)
          this.getPriceOuvrageElem(this.ouvrageElementaire)
          this.formRatioOuvrageElemCout();
          this.uRatioUpdate(this.ouvrageElementaire)
          this.formGroupOuvrageElementaire(this.ouvrageElementaire)
          this.getAllCout(data.EntrepriseId)
          this.getAllTypeCouts(data.EntrepriseId)
          this.getAllFournisseurs(data.EntrepriseId)
        })
      })
}
  updateOuvrageElementaireOnChange() {
    console.log("test")
    this.ouvrageElementaireService.update(this.formOuvrageElementaire.getRawValue(), this.ouvrageElementaireID).subscribe(() => {
        this.getById()
      }
    )
  }
  getPriceOuvrageElem(ouvrageElem: OuvrageElementaire){
    this.ouvrageElementaireService.getPriceOuvrageElementaire(ouvrageElem)
    this.getTotalPriceCout()

  }
  getTotalPriceCout(){
    this.ouvrageElementaire.Couts?.forEach((cout:Cout)=>{
      console.log("cout de l ouvrage elementaire", cout)
      if(cout.OuvragesElementairesCouts?.ratio )
        cout.debourseSecTotal = cout.prixUnitaire * cout.OuvragesElementairesCouts.ratio
      console.log("debourse sec total ", cout.debourseSecTotal)
    })
  }
  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.ouvrageElementaireCoutService.deleteByID(id, this.ouvrageElementaire.id).subscribe(() => this.ngOnInit())

      }
    });
  }
  openDialogCreate(cout: Cout | null) {
    this.coutService.openDialogCreate(cout, () => {
      this.getById()
    });
  }
  ratioChange(cout: Cout) {
    const ouvrageElemCout = {
      OuvragesElementaireId: this.ouvrageElementaireID,
      CoutId: cout.id,
      ratio: +this.myFormGroup.getRawValue().ratioCout,
      uRatio: cout.OuvrageCout?.uRatio
    }
    this.ouvrageElementaireCoutService.updateOuvrageElemCout(cout.id, this.ouvrageElementaireID, ouvrageElemCout).subscribe(() => {
      this.getById()
    })
  }


// }
  goBack() {
    this.location.back();
  }

  openDialogCreateCout() {
    console.log('list type cotu',this.listTypeCout)
    console.log('list fournisseur',this.listFournisseur)
    console.log('ouvrage elem',this.ouvrageElementaire)
    this.dialog.open(DialogFormCoutComponent, {
      data: [ this.listTypeCout, this.listFournisseur, this.ouvrageElementaire],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }

  openDialogImport() {
    this.dialog.open(OuvrageElementaireAddCoutComponent, {
      panelClass:"test",
      data: this.ouvrageElementaire,
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
}
