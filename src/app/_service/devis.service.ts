import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const baseUrl = 'http://localhost:4000/devis';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  // public devis !: Observable<Devis>;


  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  getLotSubLot(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/devis/${id}`)

  }

  update(devis: any, id: any): Observable<any> {
    return this.http.put(`http://localhost:4000/devis/${id}`, devis)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`http://localhost:4000/devis/${id}`)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/devis/${id}`)
  }

  getByIdExceptFrais(id: any): Observable<any> {
    console.log("devis service id : ", id)
    return this.http.get(`http://localhost:4000/devis/exceptFrais/${id}`)
  }

  getDevisByUser(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/devis/byUser/${id}`)
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/new`, data)
  }

  getLotFraisDeChantier(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/fraisDeChantier/${id}`)
  }
}

