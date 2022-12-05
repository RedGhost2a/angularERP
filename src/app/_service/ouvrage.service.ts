import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Ouvrage} from "../_models/ouvrage";

const baseUrl = `${environment.apiUrl}/ouvrages`;

@Injectable({
  providedIn: 'root'
})
export class OuvrageService {

  constructor(private http: HttpClient) { }

  getAll() :Observable<Ouvrage[]> {
    return this.http.get<Ouvrage[]>(baseUrl);
  }
  getAllCouts() :Observable<Ouvrage[]> {
    return this.http.get<Ouvrage[]>(`${baseUrl}/isCouts`);
  }
  getAllFraisDeChantier() :Observable<Ouvrage[]> {
    return this.http.get<Ouvrage[]>(`${baseUrl}/isFraisDeChantiers`);
  }
  getById(id:number) :Observable<any> {
    return this.http.get<Ouvrage>(`${baseUrl}/${id}`);
  }
  create(data: Ouvrage) :Observable<Ouvrage> {
    return this.http.post<Ouvrage>(baseUrl, data);
  }
  update(data:Ouvrage, id:number):Observable<Ouvrage>{
    return this.http.put<Ouvrage>(`${baseUrl}/${id}`, data)
  }
  deleteByID(id:number):Observable<Ouvrage>{
    console.log(`${baseUrl}/${id}`)
    return this.http.delete<Ouvrage>(`${baseUrl}/${id}`)
  }
  addCoutOuvrage(coutId:number, ouvrageId:number) :Observable<any> {
    console.log(` console log ADD COUT: http://localhost:8080/ouvragesCouts/new/${coutId}/${ouvrageId}`)
    return this.http.get(`http://localhost:8080/ouvragesCouts/new/${coutId}/${ouvrageId}`);
  }
  getSum(ouvrageId:number): Observable<any>{
    return this.http.get(`${baseUrl}/test/sum/${ouvrageId}`)
  }


}
