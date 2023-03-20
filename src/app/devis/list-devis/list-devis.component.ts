import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevisService} from "../../_service/devis.service";
import {Devis} from "../../_models/devis";
import {Client} from "../../_models/client";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {EditDevisComponent} from "../edit-devis/edit-devis.component";
import {UserService} from "../../_service/user.service";

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
  dataSource!: any;


  listDevis !: Devis[];
  entrepriseID !: number;
  allDevis!: Devis[];

  constructor(private devisService: DevisService,
              private dialog: MatDialog,
              public userService: UserService) {
  }

  ngOnInit(): void {

    this.getAllDevisForAdmin()
    this.getDevisByEnterprise()
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

  getDevisByEnterprise(): void {
    this.userService.getById(this.userService.userValue.id).subscribe(data => {
      this.entrepriseID = data.Entreprises[0].id
      console.log(this.entrepriseID)

      this.devisService.getDevisByEnterprise(this.entrepriseID).subscribe(data => {
        // console.log(data)
        this.listDevis = data.Devis
        console.log(this.listDevis)
      })
    })
  }

  getAllDevisForAdmin() {
    this.devisService.getAll().subscribe(data => {
      this.allDevis = data
      console.log(this.allDevis)
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
