import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cout} from "../_models/cout";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {environment} from '../../environments/environment';


const baseUrl = `http://localhost:4000/couts`;


@Injectable({
  providedIn: 'root'
})

export class CoutService {
  constructor(private http: HttpClient) {
  }

  getAll(entrepriseId: number): Observable<Cout[]> {
    return this.http.get<Cout[]>(`${environment.apiUrl}/couts`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/couts/${id}`);
  }

  create(data: Cout): Observable<Cout> {
    return this.http.post<Cout>(`${environment.apiUrl}/couts/new`, data);
  }

  update(data: Cout, id: number): Observable<Cout> {
    return this.http.put<Cout>(`${environment.apiUrl}/couts/${id}`, data)
  }

  deleteByID(id: number): Observable<Cout> {
    return this.http.delete<Cout>(`${environment.apiUrl}/couts/${id}`)
  }

  getLast(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/couts/lastCout`)
  }

  createCoutDuDevis(data: CoutDuDevis): Observable<CoutDuDevis> {
    console.log("createcoutdudevis", data)
    return this.http.post<CoutDuDevis>(`${environment.apiUrl}/coutsDuDevis/new`, data)
  }

  createOuvrageCoutDuDevis(ouvrageId: any, coutDuDevis: CoutDuDevis): Observable<any> {
    console.log('data cout service ', coutDuDevis)
    return this.http.post(`${environment.apiUrl}/coutsDuDevis/test/${ouvrageId}`, coutDuDevis)
  }


}
