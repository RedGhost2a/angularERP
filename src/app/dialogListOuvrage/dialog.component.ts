import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Cout} from "../_models/cout";
import {MatTableDataSource} from "@angular/material/table";
import {Client} from "../_models/client";
import {Ouvrage} from "../_models/ouvrage";


@Component({
  selector: 'app-dialogListOuvrage',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DialogComponent implements OnInit {

  panelOpenState = false;
  selectedOuvrageIds: number[] = [];
  dataSource !: MatTableDataSource<Ouvrage>
  initialData!: any[]; // Déclarez la variable initialData comme étant un tableau de type any
  columnsToDisplay = [
    "checkBox",
    "designation",
    "benefice",
    "aleas", "unite", "ratio", "uRatio", "prixUnitaire",
  ];
  expandedElement: any ;




  constructor(@Inject(MAT_DIALOG_DATA) public data: Ouvrage [], private dialogRef: MatDialogRef<DialogComponent>) {
    this.initialData = this.data;

  }

  ngOnInit(): void {
    console.log(this.initialData)
    this.dataSource = new MatTableDataSource(this.initialData)
    // this.dataSource = this.initialData
    this.setPriceOuvrage()

  }
  expandedRows: { [key: number]: boolean } = {};

  expand(element: any) {
    this.expandedRows[element] = !this.expandedRows[element]
  }
  setPriceOuvrage(){
    this.initialData.forEach(ouvrage=>{
      // if(ouvrage.prix === 0){
        if(ouvrage.Couts?.length >= 1){
          ouvrage.prix = 0;
        ouvrage.Couts.forEach((cout : any) => {
          ouvrage.prix += cout.prixUnitaire * cout.OuvrageCout.ratio
        })
      }
    })
  }
  onSelectionChange(id: number, isChecked: boolean) {
    if (isChecked) {
      // Ajouter l'id au tableau si la checkbox est cochée
      this.selectedOuvrageIds.push(id);
      console.log(this.data)
    } else {
      // Retirer l'id du tableau si la checkbox est décochée
      const index = this.selectedOuvrageIds.indexOf(id);
      if (index !== -1) {
        this.selectedOuvrageIds.splice(index, 1);
      }
    }
    console.log(this.selectedOuvrageIds)
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close({selectedOuvrageIds: this.selectedOuvrageIds});
  }

  applyFilter(event: Event) {
    console.log(event.target)

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // // Récupérez la valeur du filtre (la valeur de l'input de recherche)
    // const filterValue = (event.target as HTMLInputElement).value;
    //
    // // Si la valeur du filtre est vide, affectez la valeur initiale de data à la propriété data
    // if (filterValue.trim() === '') {
    //   this.data = this.initialData;
    // } else {
    //   // Sinon, copiez le tableau initialData dans une variable filteredData
    //   let filteredData = [...this.initialData];
    //
    //   // Utilisez la méthode filter
    //   filteredData = filteredData.filter(obj => obj.designation.toLowerCase().includes(filterValue.trim().toLowerCase()));
    //
    //   // Affectez la valeur de filteredData à la propriété data
    //   this.data = filteredData;
    // }
  }


}







