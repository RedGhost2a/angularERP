import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DialogUniteForFormComponent} from "../dialog-unite-for-form/dialog-unite-for-form.component";
import {MatDialog} from "@angular/material/dialog";
import {UniteForForm} from "../_models/uniteForForm";

const baseUrl = `${environment.apiUrl}/unite`;

@Injectable({
  providedIn: 'root'
})
export class UniteForFormService {
  unites: UniteForForm [] = []

  constructor(private http: HttpClient, private dialog: MatDialog) {
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

  getUniteByLabel(name: string) {
    return this.http.get(`${baseUrl}/bylabel/${name}`);
  }

  create(data: any): Observable<any> {
    this.unites = [];
    return this.http.post(`${baseUrl}/new`, data);
  }

  update(id: string, data: any): Observable<any> {
    this.unites = [];
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    this.unites = [];
    return this.http.delete(`${baseUrl}/${id}`);
  }


  openCreateUniteForFormDialog(): void {
    const dialogRef = this.dialog.open(DialogUniteForFormComponent, {
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
