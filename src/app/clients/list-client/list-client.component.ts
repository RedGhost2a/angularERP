import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../_models/client";
import {ClientService} from "../../_service/client.service";

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  @Input() client!: Client;

  @Output() deleteClient: EventEmitter<any> = new EventEmitter()

  listClient !: Client[];
  displayedColumns: string[] = ['lastname', 'firstname', 'adresse', "city", "Action"];
  clickedRows = new Set<Client>();

  constructor(private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.getAll()

  }

  delete(id: any): void {
    this.clientService.deleteByID(id).subscribe((() => this.ngOnInit()))
  }

  getAll(): void {
    this.clientService.getAll().subscribe(data => this.listClient = data)

  }

}
