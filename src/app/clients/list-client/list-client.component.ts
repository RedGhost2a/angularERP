import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../_models/client";
import {ClientService} from "../../_service/client.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  @Input() client!: Client;

  @Output() deleteClient: EventEmitter<any> = new EventEmitter()
  public listClient!: Client[];
  dataSource !: any

  displayedColumns: string[] = ['lastname', 'firstname', 'adresse', "city", "Action"];
  clickedRows = new Set<Client>();
  public values!: string;

  constructor(private clientService: ClientService) {
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

  delete(id: any): void {
    this.clientService.deleteByID(id).subscribe((() => this.ngOnInit()))
  }

  getAll(): void {
    this.clientService.getAll().subscribe(data => {
        this.listClient = data
        // this.dataSource = this.listClient
        this.dataSource = new MatTableDataSource(this.listClient);

      }
    )

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
