import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  register(client: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/clients/new`, client);
  }

  getByCompany(id: any) {
    return this.http.get(`${environment.apiUrl}/clients/${id}/`);

  }


  getAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/clients`)

  }

  update(client: any, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/clients/${id}`, client)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/${id}`)
  }

}
