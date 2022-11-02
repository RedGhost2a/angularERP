import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client} from "../_models/client";


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public client !:Observable<Client>;

  constructor( private router: Router,
               private http: HttpClient) { }

  register(client: Client) {
    return this.http.post(`/new`, client);
  }


  getAll() {
    console.log( this.http.get<Client[]>(`/`));

  }

}
