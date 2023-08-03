import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevisService} from "../../_service/devis.service";
import {Devis} from "../../_models/devis";
import {Client} from "../../_models/client";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {EditDevisComponent} from "../edit-devis/edit-devis.component";
import {UserService} from "../../_service/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {EditComponent} from "../../clients/edit/edit.component";
import {concatMap, from, Observable, toArray} from "rxjs";
import {User} from "../../_models/users";
import {Entreprise} from "../../_models/entreprise";
import {tap} from "rxjs/operators";
import {ClientService} from "../../_service/client.service";

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.scss']
})
export class ListDevisComponent implements OnInit {
  displayedColumns: string[] = ['nDevis', 'client', 'nomDevis', 'dateDevis', 'status', 'referent', 'prixVenteHT', 'benefice', 'aleas','entreprise', 'boutons'];
  clickedRows = new Set<Client>();
  dataSource!: MatTableDataSource<Devis> ;

  constructor(private devisService: DevisService, private dialog: MatDialog, public userService: UserService,
              private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.getDeviswithRole()
    this.dataSource.filterPredicate = this.getFilterPredicate();

  }


  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.devisService.deleteByID(id).subscribe((() => this.getDeviswithRole()))
      }
    });
  }


  private getFilterPredicate(): (data: any, filter: string) => boolean {
    return (data: any, filter: string) => {
      const searchText = filter.trim().toLowerCase();
      const client = data.Client.denomination.toLowerCase();
      const name = data.name.toLowerCase();
      const date = data.createdAt.toLowerCase();
      const status = data.status.toLowerCase();
      const referentFN = data.Users[0].firstName.toLowerCase();
      const referentLN = data.Users[0].lastName.toLowerCase();
      const valuesToSearch = [client, name, date,
        status, referentFN, referentLN];
      return valuesToSearch.some(value => value.includes(searchText));
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSuperAdmin():boolean{
    if(this.userService.currentUser.role === 'Super Admin') {
      console.log(this.userService.currentUser.role)
      return true
    }
    else {
      return false

    }
  }
  getDeviswithRole() {
    if (this.isSuperAdmin()) {
      this.devisService.getAll().subscribe((listDevis : Devis [])=>{
          this.dataSource = new MatTableDataSource(listDevis.reverse());
        console.log(this.dataSource)
        console.log(listDevis)
      })
    } else {
       this.getDevisByEntreprise();

    }
  }


  getDevisByEntreprise() {
    this.devisService.devis = [];
    from(this.userService.currentUser.Entreprises).pipe(
      concatMap((entreprise: Entreprise) => this.devisService.getDevisByEnterprise(entreprise.id)),
      toArray(),
      tap((listDevis: Devis[]) => {
        this.devisService.devis = this.devisService.devis.concat(...listDevis);
        this.dataSource = new MatTableDataSource(this.devisService.devis.reverse());
      })
    ).subscribe();
  }


  openDialogCreateDevis() {
    this.devisService.openDialogCreateDevis(null,null,()=>{
      this.getDeviswithRole()
    })
  }
  openDialogCreateClient(client: Client | null, disable: boolean){
    this.clientService.openDialogCreateClient(client,disable,()=>{
    })

  }

}
