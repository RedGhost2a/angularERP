import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {Cout} from "../_models/cout";

const baseUrl = `${environment.apiUrl}/couts`;

@Injectable({
  providedIn: 'root'
})

export class CoutService {
  constructor(private http: HttpClient) { }

  getAll() :Observable<Cout[]> {
    return this.http.get<Cout[]>(`${baseUrl}`);
  }
  getAllCouts() :Observable<Cout[]> {
    return this.http.get<Cout[]>(`${baseUrl}/isCouts`);
  }
  getAllFraisDeChantier() :Observable<Cout[]> {
    return this.http.get<Cout[]>(`${baseUrl}/isFraisDeChantier`);
  }

  getById(id:number) :Observable<Cout> {
    return this.http.get<Cout>(`${baseUrl}/${id}`);
  }
  create(data: Cout) :Observable<Cout> {
    return this.http.post<Cout>(`${baseUrl}/new`, data);
  }
  update(data:Cout, id:number):Observable<Cout>{
    return this.http.put<Cout>(`${baseUrl}/${id}`, data)
  }
  deleteByID(id:number):Observable<Cout>{
    return this.http.delete<Cout>(`${baseUrl}/${id}`)
  }
}
