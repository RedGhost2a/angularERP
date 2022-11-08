import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClientService} from "../_service/client.service";
import {Client} from "../_models/client";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  @Input() client!: Client;
  @Output() deleteClient: EventEmitter<any> = new EventEmitter()

  constructor(private clientService: ClientService) {
  }


  ngOnInit(): void {

  }

  delete(): void {
    this.clientService.deleteByID(this.client.id).subscribe(() => this.deleteClient.emit())
  }

}
