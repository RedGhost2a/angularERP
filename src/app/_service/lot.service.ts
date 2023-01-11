import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Lot} from "../_models/lot";

const baseUrl = 'http://localhost:8080/lots';

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private router: Router,
              private http: HttpClient,) {
  }


  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data);
  }

  update(lot: Lot, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/update`, lot)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`)
  }

  getLotFraisDeChantier(deviID:number): Observable<any>{
    return this.http.get(`${baseUrl}/fraisDeChantier`,{
        params : {
          DeviId: deviID
        }
        })
  }
}
