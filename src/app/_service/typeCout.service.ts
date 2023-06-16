import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TypeCout} from "../_models/type-cout";
import {environment} from '../../environments/environment';
import {FormTypeCoutComponent} from "../form-type-cout/form-type-cout.component";
import {MatDialog} from "@angular/material/dialog";

const baseUrl = `${environment.apiUrl}/typeCouts`;

@Injectable({
  providedIn: 'root'
})
export class TypeCoutService {
  typeCouts : TypeCout[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  getAllTypeCouts(entrepriseId: number): Observable<TypeCout[]> {
    return this.http.get<TypeCout[]>(`${baseUrl}`, {
      params: {
        EntrepriseId: entrepriseId
      }
    })
  }
  getAllForList(entrepriseId: number): Observable<TypeCout[]> {
    return this.http.get<TypeCout[]>(`${baseUrl}/listTypeCout`, {
      params: {
        EntrepriseId: entrepriseId
      }
    })
  }

  getTypeCoutById(id: number): Observable<TypeCout> {
    return this.http.get<TypeCout>(`${baseUrl}/${id}`)
  }

  getCategorieByType(type: string): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/type/${type}`);
  }


  getTypeCoutIdByLabel(categorie: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/categorie/${categorie}`);
  }


  deleteTypeCoutById(id: number): Observable<TypeCout> {
    this.typeCouts = []
    return this.http.delete<TypeCout>(`${baseUrl}/${id}`)
  }

  updateTypeCout(id: number, data: TypeCout): Observable<TypeCout> {
    this.typeCouts = []
    return this.http.put<TypeCout>(`${baseUrl}/${id}`, data)
  }

  createTypeCout(data: TypeCout): Observable<TypeCout> {
    this.typeCouts = [];
    return this.http.post<TypeCout>(`${baseUrl}/new`, data)
  }

  openDialogCreate(typeCout:TypeCout | null, refreshData:any) {
    this.dialog.open(FormTypeCoutComponent, {
      data: typeCout,
      width: '70%',
      height: '37%'
    }).afterClosed().subscribe(async result => {
      refreshData()

    });
  }



}
