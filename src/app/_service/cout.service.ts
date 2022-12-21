import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {Cout} from "../_models/cout";
import {CoutDuDevis} from "../_models/cout-du-devis";


const baseUrl = `${environment.apiUrl}/couts`;
const test = environment.apiUrl

@Injectable({
  providedIn: 'root'
})

export class CoutService {
  constructor(private http: HttpClient) { }

  getAll(entrepriseId:number) :Observable<Cout[]> {
    return this.http.get<Cout[]>(`${baseUrl}`,{
      params :{
        EntrepriseId:entrepriseId
      }
    });
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
  getLast():Observable<any>{
    return this.http.get(`${baseUrl}/lastCout`)
  }
  createCoutDuDevis(data:CoutDuDevis):Observable<CoutDuDevis>{
    console.log("createcoutdudevis",data)
    return this.http.post<CoutDuDevis>(`http://localhost:4000/coutsDuDevis/new`,data)
  }
}
