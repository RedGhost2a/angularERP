import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/users";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router,
              private http: HttpClient) {
  }

  register(user: User): Observable<any> {
    return this.http.post('http://localhost:4000/users/new', user);
  }


  getAll(): Observable<any> {
    return this.http.get(`http://localhost:4000/users`)

  }

  update(user: User, id: any): Observable<any> {
    return this.http.put(`http://localhost:4000/users/${id}`, user)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/users/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`http://localhost:4000/users/${id}`)
  }

}
