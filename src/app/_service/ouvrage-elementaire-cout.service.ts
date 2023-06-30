import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OuvrageElementaireCout} from "../_models/ouvrage-elementaire-cout";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
const baseUrl = `${environment.apiUrl}/ouvragesElementaireCouts`;

@Injectable({
  providedIn: 'root'
})
export class OuvrageElementaireCoutService {



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

  deleteByID(CoutId: any, OuvrageId: any): Observable<any> {
    // console.log(`${baseUrl}/${id}`)
    console.log(`${baseUrl}/${CoutId}/${OuvrageId}`)
    return this.http.delete(`${baseUrl}/${CoutId}/${OuvrageId}`)
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

  updateOuvrageCoutDuDevis(coutDuDeviId: number, OuvrElemDuDeviId: number, ouvrageCoutDuDevis: OuvrageCoutDuDevis): Observable<OuvrageCoutDuDevis> {
    console.log(coutDuDeviId,ouvrageCoutDuDevis,OuvrElemDuDeviId)
    return this.http.put<OuvrageCoutDuDevis>(`${baseUrl}DuDevis/${coutDuDeviId}/${OuvrElemDuDeviId}`, ouvrageCoutDuDevis)
  }

  //A voir pour remplacer la fonction updateOuvrageCoutDuDevis dans le component createdevis.ts
  createOuvrageElemCoutDuDevis(data: any): Observable<any> {
    return this.http.post(`${baseUrl}DuDevis/new`, data)
  }

  createOuvrageOuvrageElemDuDevis(data: any): Observable<any> {
    return this.http.post(`${baseUrl}DuDevis/newOuvrage`, data)
  }
  createOuvrageCoutByDesignation(ouvrageDuDevisId:number, data:any):Observable<any>{
    return this.http.post(`${baseUrl}/sousDetail/new/${ouvrageDuDevisId}`, data)
  }

  deleteCoutAndOuvrageDuDevis(CoutDuDeviId: number,OuvrageDuDeviId:number ):Observable<any>{
    return this.http.delete(`${baseUrl}DuDevis/${CoutDuDeviId}/${OuvrageDuDeviId}`)
  }

}
