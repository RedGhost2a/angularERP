import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Observable} from "rxjs";


const baseUrl = `${environment.apiUrl}/sousLotsOuvrages`;


@Injectable({
  providedIn: 'root'
})
export class SousLotOuvrageService {

  constructor(private router: Router,
              private http: HttpClient) { }

  update(id:number, sousLotOuvrage: SousLotOuvrage): Observable<SousLotOuvrage>{
    return this.http.put<SousLotOuvrage>(`${baseUrl}/${id}`,sousLotOuvrage)
  }

  getSommeSousLot(id:number):Observable<number>{
    return this.http.get<number>(`${baseUrl}/sum/${id}`)
  }

}
