import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Entreprise} from "../_models/entreprise";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  register(entreprise: Entreprise): Observable<any> {
    return this.http.post('http://localhost:4000/entreprises/new', entreprise);
  }


  getAll(): Observable<any> {
    return this.http.get(`http://localhost:4000/entreprises`)

  }

  update(entreprise: Entreprise, id: string): Observable<any> {
    return this.http.put(`http://localhost:4000/entreprises/${id}`, entreprise)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/entreprises/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`http://localhost:4000/entreprises/${id}`)
  }

}
