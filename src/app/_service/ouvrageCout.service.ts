import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const baseUrl = 'http://localhost:8080/ouvragesCouts';

@Injectable({
  providedIn: 'root'
})
export class OuvrageCoutService {

  constructor(private http: HttpClient) { }

  getAll() :Observable<any> {
    return this.http.get(baseUrl);
  }
  getById(id:any) :Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: any) :Observable<any> {
    return this.http.post(baseUrl, data);
  }
  deleteByID(CoutId:any, OuvrageId:any):Observable<any>{
    // console.log(`${baseUrl}/${id}`)
    console.log(`${baseUrl}/${CoutId}/${OuvrageId}`)
    return this.http.delete(`${baseUrl}/${CoutId}/${OuvrageId}`)
  }

  // addCoutOuvrage(coutId:number, ouvrageId:number) :Observable<any> {
  //   return this.http.get(`${baseUrl}/new/${coutId}/${ouvrageId}`);
  // }

  getSumAllOuvrage(): Observable<any>{
    return this.http.get(`${baseUrl}/price}`)
  }
  getSumOuvrageById(ouvrageId:number): Observable<any>{
    return this.http.get(`${baseUrl}/price/${ouvrageId}`)
  }



}
