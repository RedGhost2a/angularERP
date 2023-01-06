import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const baseUrl = 'http://localhost:4000/ouvrages';

@Injectable({
  providedIn: 'root'
})
export class OuvrageService {

  constructor(private http: HttpClient) {
  }

  getAll(entrepriseId: number): Observable<any> {
    return this.http.get(baseUrl, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data);
  }

  createSousLotOuvrageForDevis(data: { ouvrageId: number | number[], sousLotId: number }): Observable<any> {
    return this.http.post(`${baseUrl}/sousLot`, data);
  }


  update(data: any, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data)
  }

  deleteByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}/${id}`)
  }

  // addCoutOuvrage(coutId:number, ouvrageId:number) :Observable<any> {
  //   console.log(` console log ADD COUT: http://localhost:8080/ouvragesCouts/new/${coutId}/${ouvrageId}`)
  //   return this.http.get(`http://localhost:8080/ouvragesCouts/new/${coutId}/${ouvrageId}`);
  // }
  // getSum(ouvrageId:number): Observable<any>{
  //   return this.http.get(`${baseUrl}/test/sum/${ouvrageId}`)
  // }


}
