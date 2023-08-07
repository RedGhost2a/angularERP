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
import {ActivatedRoute} from "@angular/router";
import {SousLotService} from "../_service/sous-lot.service";
import {Ouvrage} from "../_models/ouvrage";
import {da} from "date-fns/locale";
import {isNumber} from "chart.js/helpers";
import {DevisService} from "../_service/devis.service";

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
  regexDevisCreate = new RegExp(`^/devisCreate`)
  inLot: boolean = false;

  ouvrage !: Ouvrage;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>, private ouvrageService: OuvrageService,
              private coutService: CoutService, private dataSharingService: DataSharingService, private ouvrageCoutService: OuvrageCoutService,
              private sousLotOuvrageService: SousLotOuvrageService, private route: ActivatedRoute, private sousLotService: SousLotService,
              private devisService : DevisService) {
    this.initialData = this.data;
    this.dataSource = new MatTableDataSource(this.initialData[0]);


  }

  ngOnInit(): void {
    console.log("devis " ,this.devisService.currentDevis)
    // console.log("rooute ", window.location.pathname)
    // console.log("ouvrage ", this.dataSharingService.ouvrage)
    // this.dataSource = new MatTableDataSource(this.data);
    console.log("initial data", this.initialData)
  }

  createSousLotAndOuvrage() {
    this.selectedCoutIds.forEach((element) => {
      let dataForSousLot = {
        designation: `SousLotHiddenForCoutDuDevisInLot${this.initialData[3]}`,
        devisId: this.initialData[3]
      }
      this.sousLotService.createHiddenSouslot(dataForSousLot, this.initialData[1]).subscribe((sousLotData) => {

        let dataForOuvrage = {
          designation: `OuvrageHiddenForCoutInLot${this.initialData[3]}`,
          benefice: this.devisService.currentDevis.beneficeInPercent,
          aleas: this.devisService.currentDevis.aleasInPercent,
          unite: 'hiddenUnite',
          ratio: 1,
          uRatio: 'hiddenUnite',
          prix: 0,
          alteredBenefOrAleas: false,
          EntrepriseId: 1,
        };

        this.ouvrageService.createOuvrageDuDevis(dataForOuvrage).subscribe(response => {
          const sousLotOuvrageDuDevis = {
            SousLotId: sousLotData.sousLot.id,
            OuvrageDuDeviId: response.OuvrageDuDevis?.id,
            prixOuvrage: response.prix,
            prixUniVenteHT: 0,
            prixVenteHT: 0,
            quantityOuvrage: 1,
            prixUniHT: 0,
            prixEquiHT: 0,
            prixUniEquiHT: 0,
            beneficeInEuro: 0,
            aleasInEuro: 0,
            prixCalcHT: 0,
            prixUniCalcHT: 0
          }

          this.ouvrageService.createSousLotOuvrageForDevis(sousLotOuvrageDuDevis).subscribe((data) => {
            this.coutService.getById(element).subscribe(cout => {
              if (cout.Fournisseur && cout.TypeCout) {
                this.coutDuDevis = cout;
                this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
                this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
                this.coutDuDevis.id = undefined
                this.coutDuDevis.type = cout.TypeCout.type
                this.coutDuDevis.categorie = cout.TypeCout.categorie
                const uRatio = `${cout.unite}/${response.OuvrageDuDevis?.unite}`
                this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
                    const ouvrageCout: OuvrageCoutDuDevis = {
                      OuvrageDuDeviId: response.OuvrageDuDevis?.id,
                      CoutDuDeviId: responseCout?.id,
                      ratio: 1,
                      uRatio: uRatio,
                    }
                    this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe(() => {
                      // console.log("import sous lot ouvrage response ", data)
                      // console.log("import cout du devis response ", responseCout)
                      if (responseCout.id)
                        this.coutService.getCoutDuDevisById(responseCout?.id).subscribe((coutDuDevis: any) => {
                          this.sousLotOuvrageService.updatedPrice(data[0].id, {prixOuvrage: coutDuDevis.prixUnitaire}).subscribe((response) => {
                            this.closeDialog()
                          })
                        })
                    })
                  }
                )

              }
            })
          })
        })
      })
    })

  }
  createdOuvrage() {
    this.selectedCoutIds.forEach((element) => {
        let dataForOuvrage = {
          designation: `OuvrageHiddenForCoutInLot${this.initialData[3]}`,
          benefice: 11,
          aleas: 11,
          unite: 'hiddenUnite',
          ratio: 1,
          uRatio: 'hiddenUnite',
          prix: 0,
          alteredBenefOrAleas: false,
          EntrepriseId: 1,
        };

        this.ouvrageService.createOuvrageDuDevis(dataForOuvrage).subscribe(response => {
          const sousLotOuvrageDuDevis = {
            SousLotId: this.initialData[2],
            OuvrageDuDeviId: response.OuvrageDuDevis?.id,
            prixOuvrage: response.prix,
            prixUniVenteHT: 0,
            prixVenteHT: 0,
            quantityOuvrage: 1,
            prixUniHT: 0,
            prixEquiHT: 0,
            prixUniEquiHT: 0,
            beneficeInEuro: 0,
            aleasInEuro: 0,
            prixCalcHT: 0,
            prixUniCalcHT: 0
          }

          this.ouvrageService.createSousLotOuvrageForDevis(sousLotOuvrageDuDevis).subscribe((data) => {
            this.coutService.getById(element).subscribe(cout => {
              if (cout.Fournisseur && cout.TypeCout) {
                this.coutDuDevis = cout;
                this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
                this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
                this.coutDuDevis.id = undefined
                this.coutDuDevis.type = cout.TypeCout.type
                this.coutDuDevis.categorie = cout.TypeCout.categorie
                const uRatio = `${cout.unite}/${response.OuvrageDuDevis?.unite}`
                this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
                    const ouvrageCout: OuvrageCoutDuDevis = {
                      OuvrageDuDeviId: response.OuvrageDuDevis?.id,
                      CoutDuDeviId: responseCout?.id,
                      ratio: 1,
                      uRatio: uRatio,
                    }
                    this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe(() => {
                      // console.log("import sous lot ouvrage response ", data)
                      // console.log("import cout du devis response ", responseCout)
                      if (responseCout.id)
                        this.coutService.getCoutDuDevisById(responseCout?.id).subscribe((coutDuDevis: any) => {
                          this.sousLotOuvrageService.updatedPrice(data[0].id, {prixOuvrage: coutDuDevis.prixUnitaire}).subscribe((response) => {
                            this.closeDialog()
                          })
                        })
                    })
                  }
                )

              }
            })
          })
        })
      })

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
      const valuesToSearch = [type, designation, categories];
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
    // if (this.regexDevisCreate.test(window.location.pathname)) {
    //si on import les couts depuis un lot
      if(isNumber(this.initialData[1])){
      this.createSousLotAndOuvrage()
      this.inLot = true;
      }
      //si on import les couts depuis un sous lot
        if(isNumber(this.initialData[2])){
          this.createdOuvrage()
          this.inLot = true;
        }
    else {
      console.log()
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
                this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe(() => {
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
            this.ouvrageCoutService.createOuvrageCoutByDesignation(this.dataSharingService.ouvrage.id, ouvrageCout).subscribe(() => {
              this.closeDialog()
            })
          }
        })
      })

    }
  }


}

