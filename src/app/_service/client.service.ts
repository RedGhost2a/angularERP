import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';
import {Client} from "../_models/client";
import {EditComponent} from "../clients/edit/edit.component";
import {MatDialog} from "@angular/material/dialog";


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clients :Client [] = [];


  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog) {
  }

  register(client: any): Observable<any> {
    this.clients = []
    return this.http.post(`${environment.apiUrl}/clients/new`, client);
  }

  getByCompany(id: any) {
    return this.http.get(`${environment.apiUrl}/clients/${id}/`);
  }

  getAllByEntreprise(entrepriseId:number): Observable<any>{
    this.clients = [] ;
    return this.http.get(`${environment.apiUrl}/clients/entreprise`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }
  getByDenomination(denomination:any){
    return this.http.get(`${environment.apiUrl}/clients/by/denomination`, {
      params: {
        denomination: denomination
      }
    });
  }


  getAll(): Observable<any> {
    this.clients = [];
    return this.http.get(`${environment.apiUrl}/clients`)

  }

  update(client: any, id: number): Observable<any> {
    this.clients = [];
    return this.http.put(`${environment.apiUrl}/clients/${id}`, client)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/clients/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    this.clients = [];
    return this.http.delete(`${environment.apiUrl}/clients/${id}`)
  }
  openDialogCreateClient(client: Client | null, disable: boolean, refreshData:any) {
    this.dialog.open(EditComponent, {
      data: [client, disable],
      width: '90%',
      height: '80%'
    }).afterClosed().subscribe(async result => {
      refreshData()

    });
  }

}
