import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Fournisseur} from "../_models/fournisseur";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TypeCout} from "../_models/type-cout";

const baseUrl = `${environment.apiUrl}/typeCouts`;

@Injectable({
  providedIn: 'root'
})
export class TypeCoutService {

  constructor(private http : HttpClient) { }

  getAllTypeCouts(entrepriseId:number):Observable<TypeCout[]>{
    return this.http.get<TypeCout[]>(`${baseUrl}`,{
        params : {
          EntrepriseId: entrepriseId
        }
      })
  }
  getTypeCoutById(id:number): Observable<TypeCout>{
    return this.http.get<TypeCout>(`${baseUrl}/${id}`)
  }
  deleteTypeCoutById(id:number):Observable<TypeCout>{
    return this.http.delete<TypeCout>(`${baseUrl}/${id}`)
  }
  updateTypeCout(id:number, data:TypeCout):Observable<TypeCout>{
    return this.http.put<TypeCout>(`${baseUrl}/${id}`,data)
  }
  createTypeCout(data:TypeCout):Observable<TypeCout>{
    return this.http.post<TypeCout>(`${baseUrl}/new`, data)
  }
}
