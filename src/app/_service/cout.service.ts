import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cout} from "../_models/cout";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {environment} from '../../environments/environment';
import {MatDialog} from "@angular/material/dialog";
import {Ouvrage} from "../_models/ouvrage";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {TypeCout} from "../_models/type-cout";
import {Fournisseur} from "../_models/fournisseur";
import {FormCoutComponent} from "../form-cout/form-cout.component";


const baseUrl = `http://localhost:4000/couts`;


@Injectable({
  providedIn: 'root'
})

export class CoutService {
  couts: Cout [] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  getAll(entrepriseId: number): Observable<Cout[]> {
    this.couts = [];
    return this.http.get<Cout[]>(`${environment.apiUrl}/couts`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getAllForList(entrepriseId: number): Observable<Cout[]> {
    this.couts = [];
    return this.http.get<Cout[]>(`${environment.apiUrl}/couts/listCout`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/couts/${id}`);
  }

  getCoutDuDevisById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/coutsDuDevis/${id}`);
  }

  create(data: Cout): Observable<Cout> {
    this.couts = []
    return this.http.post<Cout>(`${environment.apiUrl}/couts/new`, data);
  }

  update(data: Cout, id: number): Observable<Cout> {
    this.couts = []
    return this.http.put<Cout>(`${environment.apiUrl}/couts/${id}`, data)
  }

  deleteByID(id: number): Observable<Cout> {
    this.couts = []
    return this.http.delete<Cout>(`${environment.apiUrl}/couts/${id}`)
  }

  deleteCoutDuDevisByID(id: number): Observable<CoutDuDevis> {
    return this.http.delete<CoutDuDevis>(`${environment.apiUrl}/coutsDuDevis/${id}`)
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

  updateCoutDuDevis(data: Cout, id: number): Observable<CoutDuDevis> {
    return this.http.put<CoutDuDevis>(`${environment.apiUrl}/coutsDuDevis/${id}`, data)
  }


  openDialogCreateCout(typeCouts: TypeCout [], fournisseurs: Fournisseur [], ouvrage: Ouvrage, refreshData: any) {
    this.dialog.open(DialogFormCoutComponent, {
      data: [typeCouts, fournisseurs, ouvrage],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async result => {
      refreshData()
    });
  }

  openDialogCreate(cout: Cout | null, refreshData: any) {
    this.dialog.open(FormCoutComponent, {
      data: cout,
      width: '70%',
      height: '40%'
    }).afterClosed().subscribe(async result => {
      refreshData()
    });
  }


  getCoutByLabel(designation: string) {
    return this.http.get(`${environment.apiUrl}/designation/:designation`)
  }
}
