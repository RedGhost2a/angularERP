import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Entreprise} from "../_models/entreprise";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  register(entreprise: any): Observable<any> {
    console.log(entreprise)
    console.log("entreprise",entreprise)
    return this.http.post(`${environment.apiUrl}/entreprises/new`, entreprise);
  }


  getAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/entreprises`)

  }


  update(entreprise: Entreprise, id: string): Observable<any> {
    console.log(id)
    return this.http.put(`${environment.apiUrl}/entreprises/${id}`, entreprise)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/entreprises/${id}`)
  }

  getClientByEntreprise(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/entreprises/admin/entreprise/client/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/entreprises/${id}`)
  }


}
