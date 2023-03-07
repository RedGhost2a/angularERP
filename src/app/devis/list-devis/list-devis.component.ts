import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevisService} from "../../_service/devis.service";
import {Devis} from "../../_models/devis";
import {Client} from "../../_models/client";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {Cout} from "../../_models/cout";
import {FormCoutComponent} from "../../form-cout/form-cout.component";
import {EditDevisComponent} from "../edit-devis/edit-devis.component";

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.scss']
})
export class ListDevisComponent implements OnInit {
  @Input() devis!: Devis;
  @Output() deleteDevis: EventEmitter<any> = new EventEmitter()

  displayedColumns: string[] = ['nDevis', 'nomDevis', 'dateDevis','client','status','referent', "boutons"];
  // displayedColumns: string[] = ['Devis n°', 'Nom', 'Client', "Status", "Action"];
  clickedRows = new Set<Client>();
  dataSource!: any;


  listDevis !: Devis[];

  constructor(private devisService: DevisService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getAll()
  }

  delete(id: any): void {
    this.devisService.deleteByID(id).subscribe((() => this.ngOnInit()))
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.devisService.deleteByID(id).subscribe((() => this.ngOnInit()))
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll(): void {
    this.devisService.getAll().subscribe(data => {
      this.listDevis = data
      console.log(this.listDevis)
    })

  }

  openDialogCreate() {
    this.dialog.open(EditDevisComponent, {
      width: '70%',
      height: '37%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }
}
