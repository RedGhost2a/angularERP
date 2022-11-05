import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client} from "../_models/client";


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor( private router: Router,
               private http: HttpClient) { }

  register(client: Client) {
    return this.http.post('http://localhost:4000/clients/new', client);
  }


  getAll() {
    return this.http.get<Client[]>(`http://localhost:4000/clients`)

  }
  update(client:Client,id:string){
    return this.http.put<Client[]>(`http://localhost:4000/clients/${id}`,client)
  }

  getById(id:any){
    return this.http.get<Client[]>(`http://localhost:4000/clients/${id}`)

  }

}
