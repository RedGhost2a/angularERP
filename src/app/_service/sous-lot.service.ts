import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Lot} from "../_models/lot";
import {environment} from '../../environments/environment';
import {SousLot} from "../_models/sous-lot";

const baseUrl = `${environment.apiUrl}/sousLots`;

@Injectable({
  providedIn: 'root'
})
export class SousLotService {

  constructor(private router: Router,
              private http: HttpClient,) {
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);

  }
  createHiddenSouslot(data:any,id:any):Observable<any> {
    console.log('console log create Souslot service hidden : ', data)
    return this.http.post(`${baseUrl}/newHiddenSousLot/${id}`, data);
  }
  create(data: any, id: any): Observable<any> {
    console.log(`Valeur de lotId : ${id}`);
    return this.http.post(`${baseUrl}/new/${id}`, data);
  }

  update(sousLot: SousLot, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, sousLot)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`)
  }

}
