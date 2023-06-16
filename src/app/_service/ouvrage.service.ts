import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Ouvrage} from "../_models/ouvrage";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {environment} from '../../environments/environment';
import {FormOuvrageComponent} from "../form-ouvrage/form-ouvrage.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";

const baseUrl = `${environment.apiUrl}/ouvrages`;

@Injectable({
  providedIn: 'root'
})
export class OuvrageService {
  ouvrages: Ouvrage [] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  getOuvrageDuDevisById(id: number): Observable<Ouvrage> {
    return this.http.get<Ouvrage>(`${baseUrl}DuDevis/${id}`)
  }

  getAll(entrepriseId: number): Observable<any> {
    this.ouvrages = []
    return this.http.get(baseUrl, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }
  getAllWithCouts(entrepriseId: number): Observable<any> {
    this.ouvrages = []
    return this.http.get(`${baseUrl}/couts`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getById(id: number): Observable<any> {
    // console.log("ID",id)
    // console.log(`get by id ouvrage service ${baseUrl}/${id}`)
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    this.ouvrages = []
    return this.http.post(`${baseUrl}/new`, data);
  }

  // createSousLotOuvrageForDevis(data: { ouvrageId: number | number[], sousLotId: number }): Observable<any> {

  // createSousLotOuvrageForDevis(data: SousLotOuvrage): Observable<any> {
  //   return this.http.post(`${baseUrl}/sousLot`, data);
  // }
  createSousLotOuvrageForDevis(data: SousLotOuvrage): Observable<any> {
    console.log("data ", data)
    return this.http.post(`${environment.apiUrl}/ouvragesDuDevis/sousLot/`, data);
  }


  update(data: any, id: any): Observable<any> {
    this.ouvrages = []
    return this.http.put(`${baseUrl}/${id}`, data)
  }

  updateOuvrageDuDevis(data: any, id: any): Observable<any> {
    return this.http.put(`${baseUrl}DuDevis/${id}`, data)
  }

  deleteByID(id: any): Observable<any> {
    this.ouvrages = []
    return this.http.delete(`${baseUrl}/${id}`)
  }

  getAllExceptFraisDeChantier(entrepriseId: number): Observable<Ouvrage[]> {
    return this.http.get<Ouvrage[]>(`${baseUrl}/exceptFrais`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  getAllFraisDeChantier(entrepriseId: number): Observable<Ouvrage[]> {
    return this.http.get<Ouvrage[]>(`${baseUrl}/isFraisDeChantiers`, {
      params: {
        EntrepriseId: entrepriseId
      }
    });
  }

  createOuvrageDuDevis(data: Ouvrage): Observable<Ouvrage> {
    return this.http.post<Ouvrage>(`${baseUrl}DuDevis/new`, data)
  }

  getOuvrageDuDevisByDesignation(data: Ouvrage): Observable<Ouvrage> {
    return this.http.get<Ouvrage>(`${baseUrl}DuDevis/`)
  }

  deleteOuvrageDuDevisByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}DuDevis/${id}`)
  }

  getPriceOuvrages(){
    this.ouvrages.forEach((ouvrage: Ouvrage) => {
      if (ouvrage.Couts && ouvrage.Couts?.length >= 1) {
        ouvrage.prix = ouvrage.Couts.reduce((total, cout) => {
          if (cout.OuvrageCout?.ratio) {
            return total + cout.prixUnitaire * cout.OuvrageCout.ratio;
          } else {
            return total;
          }
        }, 0);
      }
    });
  }

  getPriceOuvrage(ouvrage: Ouvrage){
    if (ouvrage.Couts && ouvrage.Couts?.length >= 1) {
      ouvrage.prix = ouvrage.Couts.reduce((total, cout) => {
        if (cout.OuvrageCout?.ratio) {
          return total + cout.prixUnitaire * cout.OuvrageCout.ratio;
        } else {
          return total;
        }
      }, 0);
    }
  }
  openDialogCreate(ouvrage: Ouvrage | null, refreshData : any) {
    this.dialog.open(FormOuvrageComponent, {
      data: ouvrage,
      width: '80%',
      height: '35%'
    }).afterClosed().subscribe(async result => {
      refreshData()

    });
  }
  openDialogList(listOuvrage : Ouvrage [],selectedOuvrageId: number [],sousLotId:number, refreshData : any) {
    this.dialog.open(DialogComponent, {
      panelClass: "test",
      data: listOuvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log("result selected id",result.selectedOuvrageIds)
        selectedOuvrageId = result.selectedOuvrageIds;
        console.log('sous lot id',sousLotId)
        refreshData(sousLotId)
      }

    });
  }


}
