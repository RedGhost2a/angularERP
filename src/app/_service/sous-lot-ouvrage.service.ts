import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';


const baseUrl = `${environment.apiUrl}/sousLotsOuvrages`;



@Injectable({
  providedIn: 'root'
})
export class SousLotOuvrageService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  update(id: number, sousLotOuvrage: SousLotOuvrage): Observable<SousLotOuvrage> {
    return this.http.put<SousLotOuvrage>(`${baseUrl}/${id}`, sousLotOuvrage)
  }

  updatedPrice(id: number, updatedPrice: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, updatedPrice);
  }

  getSommeSousLot(id: number): Observable<number> {
    return this.http.get<number>(`${baseUrl}/sum/${id}`)
  }

  createSousLotOuvrage(data : any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data)
  }


}
