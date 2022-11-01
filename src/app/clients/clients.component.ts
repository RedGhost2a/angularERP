import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
  }

}
