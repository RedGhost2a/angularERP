import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Devis} from "../_models/devis";

const baseUrl = 'http://localhost:8080/devis';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  public devis !: Observable<Devis>;


  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  update(devis: Devis, id: any): Observable<any> {
    return this.http.put(`http://localhost:4000/devis/${id}`, devis)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`http://localhost:4000/devis/${id}`)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/devis/${id}`)
  }

  getDevisByUser(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/devis/byUser/${id}`)
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data)
  }
}
