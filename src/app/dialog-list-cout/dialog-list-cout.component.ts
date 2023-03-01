import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {Cout} from "../_models/cout";
import {OuvrageService} from "../_service/ouvrage.service";
import {CoutService} from "../_service/cout.service";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {SousLotOuvrageService} from "../_service/sous-lot-ouvrage.service";

@Component({
  selector: 'app-dialog-list-cout',
  templateUrl: './dialog-list-cout.component.html',
  styleUrls: ['./dialog-list-cout.component.scss']
})
export class DialogListCoutComponent implements OnInit {

  selectedCoutIds: number[] = [];
  columnsToDisplay = [
    "checkBox",
    "type",
    "categorie", "designation", "unite", "prixUnitaire", "fournisseur"
    // , "remarque"
  ];

  initialData!: any[]; // Déclarez la variable initialData comme étant un tableau de type any
  coutDuDevis !: CoutDuDevis

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>, private ouvrageService: OuvrageService,
              private coutService: CoutService, private dataSharingService: DataSharingService, private ouvrageCoutService: OuvrageCoutService,
              private sousLotOuvrageService : SousLotOuvrageService) {
    this.initialData = this.data;

  }

  ngOnInit(): void {
    console.log("ouvrage ", this.dataSharingService.ouvrage)
  }



  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close({selectedOuvrageIds: this.selectedCoutIds});
  }

  applyFilter(event: Event) {
    // Récupérez la valeur du filtre (la valeur de l'input de recherche)
    const filterValue = (event.target as HTMLInputElement).value;

    // Si la valeur du filtre est vide, affectez la valeur initiale de data à la propriété data
    if (filterValue.trim() === '') {
      this.data = this.initialData;
    } else {
      // Sinon, copiez le tableau initialData dans une variable filteredData
      let filteredData = [...this.initialData];

      // Utilisez la méthode filter
      filteredData = filteredData.filter(obj => obj.designation.toLowerCase().includes(filterValue.trim().toLowerCase()));

      // Affectez la valeur de filteredData à la propriété data
      this.data = filteredData;
    }
  }

  onCheck(idCout: number): void {
    if (this.selectedCoutIds.indexOf(idCout) !== -1) {
      this.selectedCoutIds.forEach((element, index) => {
        if (element == idCout) this.selectedCoutIds.splice(index, 1);
      });
    } else {
      this.selectedCoutIds.push(idCout)
    }
    console.log(this.selectedCoutIds);
  }

  addCoutOuvrageDuDevis(): void {
    this.selectedCoutIds.forEach((element, index) => {
      this.coutService.getById(element).subscribe(cout => {
        console.log("cout checked", cout)
        if (cout.Fournisseur && cout.TypeCout) {
          this.coutDuDevis = cout;
          this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
          this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseurs[0].remarque : ""
          //donne comme valeur undefined a l'id sinon le coutDuDevis sera creer avec l'id du Cout
          this.coutDuDevis.id = undefined
          this.coutDuDevis.type = cout.TypeCout.type
          this.coutDuDevis.categorie = cout.TypeCout.categorie
          const uRatio = `${cout.unite}/${this.dataSharingService.ouvrage.unite}`
          console.log('this cout du devis ', this.coutDuDevis)
          this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
              const ouvrageCout: OuvrageCoutDuDevis = {
                OuvrageDuDeviId: this.dataSharingService.ouvrage.id,
                CoutDuDeviId: responseCout?.id,
                ratio: 1,
                uRatio:uRatio,
              }
              this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe()
            }
          )
        }

      })
    })

  }


}

