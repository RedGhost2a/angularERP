import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OuvrageElementaireCout} from "../_models/ouvrage-elementaire-cout";
import {environment} from "../../environments/environment";
const baseUrl = `${environment.apiUrl}/ouvragesOuvragesElementaires`;

@Injectable({
  providedIn: 'root'
})
export class OuvrageOuvragesElementairesService {


  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`${baseUrl}/new`, data);
  }

  deleteByID(OuvragesElementaireId: any, OuvrageId: any): Observable<any> {
    // console.log(`${baseUrl}/${id}`)
    console.log(`${baseUrl}/${OuvragesElementaireId}/${OuvrageId}`)
    return this.http.delete(`${baseUrl}/${OuvrageId}/${OuvragesElementaireId}`)
  }


  getSumAllOuvrage(): Observable<any> {
    return this.http.get(`${baseUrl}/price`)
  }

  getSumOuvrageById(ouvrageId: number): Observable<any> {
    return this.http.get(`${baseUrl}/price/${ouvrageId}`)
  }

  updateOuvrageCout(coutId: number, ouvrageId: number, ouvrageElemCout: OuvrageElementaireCout): Observable<OuvrageElementaireCout> {
    return this.http.put<OuvrageElementaireCout>(`${baseUrl}/${coutId}/${ouvrageId}`, ouvrageElemCout)
  }

  // updateOuvrageCoutDuDevis(coutDuDeviId: number, ouvrageDuDeviId: number, ouvrageCoutDuDevis: OuvrageCoutDuDevis): Observable<OuvrageCoutDuDevis> {
  //   return this.http.put<OuvrageCoutDuDevis>(`${baseUrl}DuDevis/${coutDuDeviId}/${ouvrageDuDeviId}`, ouvrageCoutDuDevis)
  // }

  //A voir pour remplacer la fonction updateOuvrageCoutDuDevis dans le component createdevis.ts
  createOuvrageCoutDuDevis(data: any): Observable<any> {
    return this.http.post(`${baseUrl}DuDevis/new`, data)
  }
  createOuvrageCoutByDesignation(ouvrageDuDevisId:number, data:any):Observable<any>{
    return this.http.post(`${baseUrl}/sousDetail/new/${ouvrageDuDevisId}`, data)
  }

  deleteCoutAndOuvrageDuDevis(CoutDuDeviId: number,OuvrageDuDeviId:number ):Observable<any>{
    return this.http.delete(`${baseUrl}DuDevis/${CoutDuDeviId}/${OuvrageDuDeviId}`)
  }

}
