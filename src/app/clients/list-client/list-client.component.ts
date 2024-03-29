import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../_models/client";
import {ClientService} from "../../_service/client.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {EditComponent} from "../edit/edit.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {User} from "../../_models/users";
import {UserService} from "../../_service/user.service";
import {EditDevisComponent} from "../../devis/edit-devis/edit-devis.component";
import {Devis} from "../../_models/devis";
import {Entreprise} from "../../_models/entreprise";
import {DevisService} from "../../_service/devis.service";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;
import {DataSharingService} from "../../_service/data-sharing-service.service";

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  dataSource !: MatTableDataSource<Client>
  displayedColumns: string[] = ['denomination', 'adresse', 'city','entreprise', 'boutons'];

  constructor(private clientService: ClientService, private dialog: MatDialog, private userService: UserService,
              private devisService: DevisService, private dataSharingService:DataSharingService) {
  }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  getCurrentUser() {
    this.userService.currentUser.Entreprises.forEach((entreprise: Entreprise)=>{
      this.getAll(entreprise.id)

    })
  }

  applyFilter(event: Event) {
    this.dataSharingService.applyFilter(event,this.dataSource)
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteByID(id).subscribe((() => this.ngOnInit()))
      }
    });
  }


  openDialogCreateDevis(ClientId:number| null ,EntrepriseId:number| null){
    this.devisService.openDialogCreateDevis(ClientId ,EntrepriseId,()=>{})
  }

  getAll(entrepriseId: number): void {
    this.clientService.getAllByEntreprise(entrepriseId).subscribe((listClient: Client[]) => {
      console.log('liste des clients ',listClient)
        this.clientService.clients = this.clientService.clients.concat(listClient);
        //permet de trier les client par l'id (du plus recent au plus ancien)
        this.clientService.clients.sort((a,b) => b.id - a.id)
        this.dataSource = new MatTableDataSource(this.clientService.clients);
        console.log(this.clientService.clients);



      }
    )
  }

  openDialogCreateClient(client: Client | null, disable: boolean) {
    this.clientService.openDialogCreateClient(client, disable, () => {
      this.getCurrentUser()
    })
  }

}
