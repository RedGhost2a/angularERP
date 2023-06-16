import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OuvrageCout} from "../_models/ouvrageCout";
import {environment} from '../../environments/environment';
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {Ouvrage} from "../_models/ouvrage";
import {OuvrageAddCoutComponent} from "../ouvrage-add-cout/ouvrage-add-cout.component";
import {MatDialog} from "@angular/material/dialog";

const baseUrl = `${environment.apiUrl}/ouvragesCouts`;

@Injectable({
  providedIn: 'root'
})
export class OuvrageCoutService {

  constructor(private http: HttpClient,private dialog: MatDialog) {
  }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`${baseUrl}/new`, data);
  }

  deleteByID(CoutId: any, OuvrageId: any): Observable<any> {
    // console.log(`${baseUrl}/${id}`)
    console.log(`${baseUrl}/${CoutId}/${OuvrageId}`)
    return this.http.delete(`${baseUrl}/${CoutId}/${OuvrageId}`)
  }


  getSumAllOuvrage(): Observable<any> {
    return this.http.get(`${baseUrl}/price`)
  }

  getSumOuvrageById(ouvrageId: number): Observable<any> {
    return this.http.get(`${baseUrl}/price/${ouvrageId}`)
  }

  updateOuvrageCout(coutId: number, ouvrageId: number, ouvrageCout: OuvrageCout): Observable<OuvrageCout> {
    return this.http.put<OuvrageCout>(`${baseUrl}/${coutId}/${ouvrageId}`, ouvrageCout)
  }

  updateOuvrageCoutDuDevis(coutDuDeviId: number, ouvrageDuDeviId: number, ouvrageCoutDuDevis: OuvrageCoutDuDevis): Observable<OuvrageCoutDuDevis> {
    return this.http.put<OuvrageCoutDuDevis>(`${baseUrl}DuDevis/${coutDuDeviId}/${ouvrageDuDeviId}`, ouvrageCoutDuDevis)
  }

  //A voir pour remplacer la fonction updateOuvrageCoutDuDevis dans le component createdevis.ts
  createOuvrageCoutDuDevis(data: any): Observable<any> {
    return this.http.post(`${baseUrl}DuDevis/new`, data)
  }
  createOuvrageCoutByDesignation(ouvrageDuDevisId:number, data:any):Observable<any>{
    return this.http.post(`${baseUrl}/sousDetail/new/${ouvrageDuDevisId}`, data)
  }

  deleteCoutAndOuvrageDuDevis(CoutDuDeviId: number,OuvrageDuDeviId:number ):Observable<any>{
    return this.http.delete(`${baseUrl}DuDevis/${CoutDuDeviId}/${OuvrageDuDeviId}`)
  }
  openDialogImport(ouvrage: Ouvrage, refreshData : any) {
    this.dialog.open(OuvrageAddCoutComponent, {
      panelClass:"test",
      data: ouvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      refreshData()
    });
  }

}
