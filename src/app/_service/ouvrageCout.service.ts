import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OuvrageCout} from "../_models/ouvrageCout";
import {environment} from '../../environments/environment';

const baseUrl = `${environment.apiUrl}/ouvragesCouts`;

@Injectable({
  providedIn: 'root'
})
export class OuvrageCoutService {

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

  updateOuvrageCout(coutId: number, ouvrageId: number, ouvrageCout: OuvrageCout): Observable<OuvrageCout> {
    return this.http.put<OuvrageCout>(`${baseUrl}/${coutId}/${ouvrageId}`, ouvrageCout)
  }

  updateOuvrageCoutDuDevis(coutId: number, ouvrageId: number, ouvrageCout: OuvrageCout): Observable<OuvrageCout> {
    return this.http.put<OuvrageCout>(`${baseUrl}DuDevis/${coutId}/${ouvrageId}`, ouvrageCout)
  }

  //A voir pour remplacer la fonction updateOuvrageCoutDuDevis dans le component createdevis.ts
  createOuvrageCoutDuDevis(data: any): Observable<any> {
    return this.http.post(`${baseUrl}DuDevis/new`, data)
  }

  deleteCoutAndOuvrageDuDevis(CoutDuDeviId: number,OuvrageDuDeviId:number ):Observable<any>{
    return this.http.delete(`${baseUrl}DuDevis/${CoutDuDeviId}/${OuvrageDuDeviId}`)
  }

}
