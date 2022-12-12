import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  register(client: any): Observable<any> {
    return this.http.post('http://localhost:4000/clients/new', client);
  }


  getAll(): Observable<any> {
    return this.http.get(`http://localhost:4000/clients`)

  }

  update(client: any, id: string): Observable<any> {
    return this.http.put(`http://localhost:4000/clients/${id}`, client)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/clients/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`http://localhost:4000/clients/${id}`)
  }

}
