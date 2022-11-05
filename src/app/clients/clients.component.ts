import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {map} from "rxjs";
import {Client} from "../_models/client";
import {ClientService} from "src/app/_service/client.service"
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  client!: Client[];
  constructor(private httpClient: HttpClient, private dialog : MatDialog, private clientService: ClientService
  ) { }

  openDialog() {
    this.dialog.open(DialogComponent,{

      width: '70%',
      height: '60%',

    })
  }


  ngOnInit() {

    this.clientService.getAll().subscribe(data => {
      this.client= data

    })


}

  }
