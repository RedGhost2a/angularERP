import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TypeCout} from "../_models/type-cout";
import {environment} from '../../environments/environment';

const baseUrl = `${environment.apiUrl}/typeCouts`;

@Injectable({
  providedIn: 'root'
})
export class TypeCoutService {

  constructor(private http: HttpClient) {
  }

  getAllTypeCouts(entrepriseId: number): Observable<TypeCout[]> {
    return this.http.get<TypeCout[]>(`${baseUrl}`, {
      params: {
        EntrepriseId: entrepriseId
      }
    })
  }

  getTypeCoutById(id: number): Observable<TypeCout> {
    return this.http.get<TypeCout>(`${baseUrl}/${id}`)
  }

  getCategorieByType(type: string): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/type/${type}`);
  }

  getAllForList(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/listTypeCout`);
  }



  getTypeCoutIdByLabel(categorie: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/categorie/${categorie}`);
  }


  deleteTypeCoutById(id: number): Observable<TypeCout> {
    return this.http.delete<TypeCout>(`${baseUrl}/${id}`)
  }

  updateTypeCout(id: number, data: TypeCout): Observable<TypeCout> {
    return this.http.put<TypeCout>(`${baseUrl}/${id}`, data)
  }

  createTypeCout(data: TypeCout): Observable<TypeCout> {
    return this.http.post<TypeCout>(`${baseUrl}/new`, data)
  }
}
