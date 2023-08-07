import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Ouvrage} from "../_models/ouvrage";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {Log} from "../_models/log";
import {OuvrageElementaireCout} from "../_models/ouvrage-elementaire-cout";
const baseUrl = `${environment.apiUrl}/ouvragesElementaire`;

@Injectable({
  providedIn: 'root'
})


export class OuvrageElementaireService {
  constructor(private http: HttpClient) { }

  getOuvrageDuDevisById(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}DuDevis/${id}`)
  }

  getAll(entrepriseId: number): Observable<any> {
    return this.http.get(baseUrl, {
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
    console.log('console log create ouvrage elem service : ', data)

    return this.http.post(`${baseUrl}/new`, data);
  }





  update(data: any, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data)
  }
  getPriceOuvrageElementaire(ouvrageElem:OuvrageElementaire){
  if (ouvrageElem.Couts && ouvrageElem.Couts?.length >= 1) {
  ouvrageElem.prix = ouvrageElem.Couts.reduce((total, cout) => {
    if (cout.OuvragesElementairesCouts?.ratio) {
      return ouvrageElem.proportion * (total + cout.prixUnitaire * cout.OuvragesElementairesCouts.ratio);
    } else {
      return total;
    }
  }, 0);
}
}
  getPriceOuvrageElementaireDuDevis(ouvrageElem:OuvrageElementaire){
    if (ouvrageElem.CoutDuDevis && ouvrageElem.CoutDuDevis?.length >= 1) {
      ouvrageElem.prix = 0;
      ouvrageElem.prix = ouvrageElem.CoutDuDevis.reduce((total, coutDuDevis) => {
        if (coutDuDevis.OuvrElemCoutsDuDevis?.ratio && ouvrageElem.quantite) {
          const quantityCout = coutDuDevis.OuvrElemCoutsDuDevis.ratio * ouvrageElem.quantite
          return total + (coutDuDevis.prixUnitaire * quantityCout)
        } else {
          return total;
        }
      }, 0);
    }
  }
  getPriceOuvragesElementaire(ouvrageElem:OuvrageElementaire []){
    ouvrageElem.forEach((ouvrageElem: OuvrageElementaire) => {
      if (ouvrageElem.Couts && ouvrageElem.Couts?.length >= 1) {
        ouvrageElem.prix = ouvrageElem.Couts.reduce((total, cout) => {
          if (cout.OuvragesElementairesCouts?.ratio) {
            ouvrageElem.prixUnitaire = total + cout.prixUnitaire * cout.OuvragesElementairesCouts.ratio
            return ouvrageElem.proportion * (total + cout.prixUnitaire * cout.OuvragesElementairesCouts.ratio);
          } else {
            return total;
          }
        }, 0);
      }
    });
  }
  updateOuvrageDuDevis(data: any, id: any): Observable<any> {
    console.log("updateOE",data)
    return this.http.put(`${baseUrl}DuDevis/${id}`, data)
  }

  deleteByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}/${id}`)
  }




  createOuvrageElementaireDuDevis(data: any): Observable<any> {
    return this.http.post<Ouvrage>(`${baseUrl}DuDevis/new`, data)
  }
  //
  //
  //
  deleteOuvrageElemDuDevisByID(id: any): Observable<any> {
    console.log(`${baseUrl}/${id}`)
    return this.http.delete(`${baseUrl}DuDevis/${id}`)
  }

}
