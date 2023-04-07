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
import {OuvrageCout} from "../_models/ouvrageCout";
import {MatTableDataSource} from "@angular/material/table";

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
  isChecked: boolean = false;
  dataSource!: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>, private ouvrageService: OuvrageService,
              private coutService: CoutService, private dataSharingService: DataSharingService, private ouvrageCoutService: OuvrageCoutService,
              private sousLotOuvrageService: SousLotOuvrageService) {
    this.initialData = this.data;
    this.dataSource = new MatTableDataSource(this.initialData);


  }

  ngOnInit(): void {
    console.log("ouvrage ", this.dataSharingService.ouvrage)
     // this.dataSource = new MatTableDataSource(this.data);
    // console.log(this.initialData)
  }

  checked() {
    // if(this.isChecked){
    //   this.isChecked = false
    // }else{
    //   this.isChecked = true
    // }
    console.log(this.isChecked)
  }


  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close({selectedOuvrageIds: this.selectedCoutIds});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.trim().toLowerCase();
      const type = data.TypeCout.type.toLowerCase();
      // console.log(type)
      const designation = data.designation.toLowerCase();
      const categories = data.TypeCout.categorie.toLowerCase();
      const valuesToSearch = [type, designation,categories];
      return valuesToSearch.some(value => value.includes(searchText));
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter)
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
          console.log('addcout ouvragedu devis')
          this.coutDuDevis = cout;
          // console.log('this cout du devis ', this.coutDuDevis)
          this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
          // console.log('this cout du devis ', this.coutDuDevis)
          this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
          console.log('this cout du devis ', this.coutDuDevis)
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
                uRatio: uRatio,
              }
              console.log("this ouvrage cout ", ouvrageCout)
              this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe(()=>{
                this.closeDialog()
              })
            }
          )

        }
        if (this.isChecked === false) {
          const ouvrageCout: OuvrageCout = {
            OuvrageId: 0,
            CoutId: element,
            ratio: 1,
            uRatio: `${cout.unite}/${this.dataSharingService.ouvrage.unite}`,
          }
          this.ouvrageCoutService.createOuvrageCoutByDesignation(this.dataSharingService.ouvrage.id, ouvrageCout).subscribe(()=>{
            this.closeDialog()
          })
        }
      })
    })

  }


}

