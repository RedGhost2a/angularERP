import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Ouvrage} from "../_models/ouvrage";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";

const baseUrl = 'http://localhost:4000/ouvrages';

@Injectable({
  providedIn: 'root'
})
export class OuvrageService {

  constructor(private http: HttpClient) {
  }

  getOuvrageDuDevisById(id: number):Observable<OuvrageDuDevis>{
    return this.http.get<OuvrageDuDevis>(`${baseUrl}DuDevis/${id}`)
  }

  getAll(entrepriseId: number): Observable<any> {
    return this.http.get(baseUrl, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getById(id: number): Observable<any> {
    // console.log("ID",id)
    // console.log(`get by id ouvrage service ${baseUrl}/${id}`)
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data);
  }

  // createSousLotOuvrageForDevis(data: { ouvrageId: number | number[], sousLotId: number }): Observable<any> {

  // createSousLotOuvrageForDevis(data: SousLotOuvrage): Observable<any> {
  //   return this.http.post(`${baseUrl}/sousLot`, data);
  // }
  createSousLotOuvrageForDevis(data: SousLotOuvrage): Observable<any> {
    return this.http.post(`http://localhost:4000/ouvragesDuDevis/sousLot/`, data);
  }


  update(data: any, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data)
  }

  deleteByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}/${id}`)
  }

  createOuvrageDuDevis(data:Ouvrage):Observable<Ouvrage>{
    return this.http.post<Ouvrage>(`${baseUrl}DuDevis/new`, data)
  }

  getOuvrageDuDevisByDesignation(data:Ouvrage):Observable<Ouvrage>{
    return this.http.get<Ouvrage>(`${baseUrl}DuDevis/`)
  }




}
