import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const baseUrl = `${environment.apiUrl}/unite`;

@Injectable({
  providedIn: 'root'
})
export class UniteForFormService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  getUniteByType(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/type/${id}`);
  }

  getUniteByEntreprise(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/entreprise/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
