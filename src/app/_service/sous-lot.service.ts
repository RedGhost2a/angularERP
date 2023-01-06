import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Lot} from "../_models/lot";

const baseUrl = 'http://localhost:8080/sousLots';

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

  create(data: any, id: any): Observable<any> {
    console.log(`Valeur de lotId : ${id}`);
    return this.http.post(`${baseUrl}/new/${id}`, data);
  }

  update(lot: Lot, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/update/${id}`, lot)
  }
}
