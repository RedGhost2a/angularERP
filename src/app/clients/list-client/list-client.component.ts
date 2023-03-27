import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../_models/client";
import {ClientService} from "../../_service/client.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {EditComponent} from "../edit/edit.component";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  @Input() client!: Client;

  @Output() deleteClient: EventEmitter<any> = new EventEmitter()
  public listClient!: Client[];
  dataSource !: any
  displayedColumns: string[] = ['lastname', 'firstname', 'adresse', "city", "boutons"];
  clickedRows = new Set<Client>();
  public values!: string;

  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any | null;

  constructor(private clientService: ClientService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getAll()
    //TODO TERMINER LA FONCTION DE RECHERCHE
    console.log(this.dataSource)


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.clientService.deleteByID(id).subscribe((() => this.ngOnInit()))
      }
    });
  }

  delete(id: any): void {
    this.clientService.deleteByID(id).subscribe((() => this.ngOnInit()))
  }

  getAll(): void {
    this.clientService.getAll().subscribe(data => {
        console.log(data)
        this.listClient = data
        // this.dataSource = this.listClient
        this.dataSource = new MatTableDataSource(this.listClient);

      }
    )

  }

  openDialogCreate(client: Client | null) {
    console.log("data envoyer depuis list client", client)
    this.dialog.open(EditComponent, {
      data: client,
      width: '70%',
      height: '78%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }

  // onKey($event: KeyboardEvent) {
  //   // @ts-ignore
  //   this.values += event.target.value + ' | ';
  //   // this.dataSource.filter = this.values;
  //   return this.values;
  //
  //   // console.log(this.values);
  //
  // }
}
