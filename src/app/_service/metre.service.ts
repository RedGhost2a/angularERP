import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {da} from "date-fns/locale";

@Injectable({
  providedIn: 'root'
})
export class MetreService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/metre`);
  }
  getMetreByOuvrage(id:number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/metre/ouvrage/${id}`);
  }
  createMetre(data:any){
    console.log(data)
    return this.http.post(`${environment.apiUrl}/metre/new`, data);
  }

  updateMetre(data:any, id:number){
    return this.http.put(`${environment.apiUrl}/metre/${id}`, data);
  }
}
