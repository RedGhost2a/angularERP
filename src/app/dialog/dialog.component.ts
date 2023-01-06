import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  panelOpenState = false;
  selectedOuvrageIds: number[] = [];
  dataSource: any[] = [];
  initialData!: any[]; // Déclarez la variable initialData comme étant un tableau de type any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>) {
    this.initialData = this.data;

  }

  ngOnInit(): void {
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
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialog
    this.dialogRef.close({selectedOuvrageIds: this.selectedOuvrageIds});
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


}







