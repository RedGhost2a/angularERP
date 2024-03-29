import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';
import {Devis} from "../_models/devis";
import {EditDevisComponent} from "../devis/edit-devis/edit-devis.component";
import {MatDialog} from "@angular/material/dialog";

const baseUrl = 'http://localhost:4000/devis';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  // public devis !: Observable<Devis>;
  devis: Devis [] = [];
  currentDevis !: Devis;

  private HiddenlotId!: number;
  private HiddensousLotId!: number;

  constructor(private http: HttpClient,private dialog: MatDialog) {
  }
  setLotId(id: number) {
    this.HiddenlotId = id;
  }

  getLotId() {
    return this.HiddenlotId;
  }

  setSousLotId(id: number) {
    this.HiddensousLotId = id;
  }

  getSousLotId() {
    return this.HiddensousLotId;
  }
  getAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis`);
  }

  getLotSubLot(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/${id}`)

  }

  update(devis: any, id: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/devis/${id}`, devis)
  }

  deleteByID(id: any): Observable<any> {
    this.devis = [];
    return this.http.delete(`${environment.apiUrl}/devis/${id}`)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/${id}`)
  }

  getByIdForDetail(id:number): Observable<any>{
    return this.http.get(`${environment.apiUrl}/devis/detail/${id}`)
  }

  getByIdExceptFrais(id: any): Observable<any> {
    console.log("devis service id : ", id)
    return this.http.get(`${environment.apiUrl}/devis/exceptFrais/${id}`)
  }

  getDevisByUser(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/byUser/${id}`)
  }

  getDevisByEnterprise(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/byEntreprise/${id}`)
  }

  create(data: any): Observable<any> {
    this.devis = [];
    return this.http.post(`${environment.apiUrl}/devis/new`, data)
  }

  getLotFraisDeChantier(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/fraisDeChantier/${id}`)
  }

  getOuvrages(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/detail/ouvrages/${id}`)
  }

  //utilisé pour la creation d'un devis depuis la liste des devis
  openDialogCreateDevis(ClientId:number| null ,EntrepriseId:number| null,refreshData:any) {
    this.dialog.open(EditDevisComponent, {
      width: '70%',
      height: '37%',
      data: {ClientId: ClientId,EntrepriseId:EntrepriseId}
    }).afterClosed().subscribe(async result => {
      refreshData()
    });
  }



}

