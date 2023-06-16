import {Injectable} from '@angular/core';
import {Fournisseur} from '../_models/fournisseur'
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';
import {FormFournisseurComponent} from "../form-fournisseur/form-fournisseur.component";
import {MatDialog} from "@angular/material/dialog";

const baseUrl = `${environment.apiUrl}/fournisseurs`;


@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  fournisseurs: Fournisseur [] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  getAllFournisseurs(entrepriseId: number): Observable<Fournisseur[]> {
    this.fournisseurs = []
    return this.http.get<Fournisseur[]>(`${baseUrl}`, {
      params: {
        EntrepriseId: entrepriseId
      }
    })
  }
  getAllForList(entrepriseId: number): Observable<Fournisseur[]> {
    this.fournisseurs = []
    return this.http.get<Fournisseur[]>(`${baseUrl}/listFournisseur`, {
      params: {
        EntrepriseId: entrepriseId
      }
    })
  }

  getFournisseurIdByName(commercialName: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/name/${commercialName}`);
  }

  deleteFournisseurById(id: number): Observable<Fournisseur> {
    this.fournisseurs = []
    return this.http.delete<Fournisseur>(`${baseUrl}/${id}`)
  }

  createFournisseur(data: Fournisseur): Observable<Fournisseur> {
    this.fournisseurs = []
    return this.http.post<Fournisseur>(`${baseUrl}/new`, data)
  }

  updateFournisseur(id: number, data: Fournisseur): Observable<Fournisseur> {
    this.fournisseurs = []
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

  openDialogCreate(fournisseur:Fournisseur | null, refreshData :  any) {
    this.dialog.open(FormFournisseurComponent, {
      data: fournisseur,
      width: '70%',
      height: '37%'
    }).afterClosed().subscribe(async result => {
      refreshData();

    });
  }
}
