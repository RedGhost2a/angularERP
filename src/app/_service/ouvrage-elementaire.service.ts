import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Ouvrage} from "../_models/ouvrage";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
const baseUrl = `${environment.apiUrl}/ouvragesElementaire`;

@Injectable({
  providedIn: 'root'
})


export class OuvrageElementaireService {

  constructor(private http: HttpClient) { }

  getOuvrageDuDevisById(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}DuDevis/${id}`)
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
    console.log('console log create ouvrage elem service : ', data)

    return this.http.post(`${baseUrl}/new`, data);
  }





  update(data: any, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data)
  }
  // updateOuvrageDuDevis(data: any, id: any): Observable<any> {
  //   return this.http.put(`${baseUrl}DuDevis/${id}`, data)
  // }

  deleteByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}/${id}`)
  }




  createOuvrageElementaireDuDevis(data: any): Observable<Ouvrage> {
    return this.http.post<Ouvrage>(`${baseUrl}DuDevis/new`, data)
  }
  //
  //
  //
  deleteOuvrageElemDuDevisByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}DuDevis/${id}`)
  }

}
