import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



const baseUrl = 'http://localhost:8080/couts';

@Injectable({
  providedIn: 'root'
})

export class CoutService {

  constructor(private http: HttpClient) { }

  getAll(EntrepriseId:any) :Observable<any> {
    return this.http.get(`${baseUrl}?EntrepriseId=${EntrepriseId}`);
  }
  getById(id:any, EntrepriseId:any) :Observable<any> {
    // return this.http.get(`${baseUrl}/${id}`);
    return this.http.get(`${baseUrl}/${id}?EntrepriseId=${EntrepriseId}`);
  }
  create(data: any) :Observable<any> {
    console.log(data)
    return this.http.post(baseUrl+'/new', data);
  }
  update(data:any, id:any):Observable<any>{
    return this.http.put(`${baseUrl}/${id}`, data)
  }
  deleteByID(id:any):Observable<any>{
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}/${id}`)
  }
  createTypeCout(data:any):Observable<any>{
    return this.http.post(`http://localhost:8080/typeCouts/new`, data)
  }
}
