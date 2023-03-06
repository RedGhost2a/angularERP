import {Injectable} from '@angular/core';
import {Fournisseur} from '../_models/fournisseur'
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';

const baseUrl = `${environment.apiUrl}/fournisseurs`;

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  constructor(private http: HttpClient) {
  }

  getAllFournisseurs(entrepriseId: number): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${baseUrl}`, {
      params: {
        EntrepriseId: entrepriseId

      }
    })
  }

  deleteFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.delete<Fournisseur>(`${baseUrl}/${id}`)
  }

  createFournisseur(data: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(`${baseUrl}/new`, data)
  }

  updateFournisseur(id: number, data: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${baseUrl}/${id}`, data)
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${baseUrl}/${id}`)
  }

  createFournisseurCout(CoutId: number, FournisseurId: number): Observable<Fournisseur> {
    console.log("FOURNISSEUR SERVICE CREATEFOURNISSEURCOUT:", `${baseUrl}Couts/new/${CoutId}/${FournisseurId}`)
    return this.http.get<Fournisseur>(`${baseUrl}Couts/new/${CoutId}/${FournisseurId}`)
  }

  updateFournisseurCout(CoutId: number, FournisseurId: number, data: any): Observable<any> {
    console.log("FOURNISSEUR SERVICE UPDATEFOURNISSEURCOUT:", `${baseUrl}Couts/${CoutId}/${FournisseurId}`)
    return this.http.put<any>(`${baseUrl}Couts/${CoutId}/${FournisseurId}`, data)
  }

  // update(data:Cout, id:number):Observable<Cout>{
  //   return this.http.put<Cout>(`${baseUrl}/${id}`, data)
  // }
//http://localhost:8080/fournisseursCouts/33/3
//http://localhost:4000/fournisseursCouts/33/3
}
