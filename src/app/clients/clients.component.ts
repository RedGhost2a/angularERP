import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {map} from "rxjs";
import {Client} from "../_models/client";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  constructor(private httpClient: HttpClient, private dialog : MatDialog) { }

  openDialog() {
    this.dialog.open(DialogComponent,{

      width: '70%',
      height: '60%',

    })
  }


  ngOnInit(): void {
    //get all clients
    // @ts-ignore
    console.log( this.httpClient.get<Client>("/clients").pipe(source => {
        return this.httpClient.get("/clients").pipe(
          map(res => {
            console.log(res);
            return res;

          })
        )
      }
      )

    )}}
