import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Lot} from "../_models/lot";
import {environment} from '../../environments/environment';

const baseUrl = `${environment.apiUrl}/lots`;

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private router: Router,
              private http: HttpClient,) {
  }


  create(data: any): Observable<any> {
    console.log('console log create lot service : ', data)
    return this.http.post(`${baseUrl}/new`, data);
  }
  createLotFraisDeChantier(data:any):Observable<any> {
    console.log('console log create lot service : ', data)
    return this.http.post(`${baseUrl}/newFraisDeChantier`, data);
  }

  createHiddenLot(data:any):Observable<any> {
    console.log('console log create lot service hidden : ', data)
    return this.http.post(`${baseUrl}/newHiddenLot`, data);
  }

  update(lot: Lot, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, lot)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`)

  }

  getLotFraisDeChantier(deviID: number): Observable<any> {
    return this.http.get(`${baseUrl}/fraisDeChantier`, {
      params: {
        DeviId: deviID
      }
    })
  }
}
