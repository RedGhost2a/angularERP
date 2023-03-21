import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevisService} from "../../_service/devis.service";
import {Devis} from "../../_models/devis";
import {Client} from "../../_models/client";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {EditDevisComponent} from "../edit-devis/edit-devis.component";
import {UserService} from "../../_service/user.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.scss']
})
export class ListDevisComponent implements OnInit {
  @Input() devis!: Devis;
  @Output() deleteDevis: EventEmitter<any> = new EventEmitter()

  displayedColumns: string[] = ['nDevis', 'nomDevis', 'dateDevis', 'client', 'status', 'referent', "boutons"];
  // displayedColumns: string[] = ['Devis n°', 'Nom', 'Client', "Status", "Action"];
  clickedRows = new Set<Client>();


  entrepriseID !: number;
  dataSource = new MatTableDataSource<Devis>([]);

  constructor(private devisService: DevisService,
              private dialog: MatDialog,
              public userService: UserService) {
  }

  ngOnInit(): void {

    this.getDeviswithRole()
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }




  getDeviswithRole(){
    if (this.userService.userValue.role === 'Super Admin'){
      this.devisService.getAll().subscribe(data => {
        this.dataSource.data = data;
      })
    }else
    {
      this.userService.getById(this.userService.userValue.id).subscribe(data => {
        this.entrepriseID = data.Entreprises[0].id
        this.devisService.getDevisByEnterprise(this.entrepriseID).subscribe(data => {
          this.dataSource.data = data.Devis;
        })
      })

    }
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
