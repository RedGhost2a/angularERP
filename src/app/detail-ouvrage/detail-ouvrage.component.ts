import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Ouvrage} from "../_models/ouvrage";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {ActivatedRoute} from "@angular/router";
import {map, Observable} from "rxjs";
import {Cout} from "../_models/cout";
import {OuvrageCout} from "../_models/ouvrageCout";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-detail-ouvrage',
  templateUrl: './detail-ouvrage.component.html',
  styleUrls: ['./detail-ouvrage.component.scss']
})
export class DetailOuvrageComponent implements OnInit {
  ouvrage!:Ouvrage
  ouvrageCout!:OuvrageCout
  prixOuvrage!:number
  ouvrageID!:number
  // cout!:Cout[];
  @Output() deleteCout: EventEmitter<any> = new EventEmitter()
  columnsToDisplay = ["designation","benefice","aleas", "unite","ratio", "uRatio","prixUnitaire", "boutons"];
  myFormGroup!: FormGroup;


  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              private ouvrageCoutService: OuvrageCoutService) { }

  ngOnInit(): void {
    this.getById();
    this.myFormGroup = new FormGroup({
      ratioCout: new FormControl()
    })
    // this.getOuvragePriceById(this.ouvrageID)
  }


  getById():void{
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getById(this.ouvrageID).subscribe(data =>{
        this.ouvrage = data;
        console.log(data)
        // this.ouvrage.fournisseur = data.Couts[0].Fournisseurs[0].commercialName
        // console.log("FOURNISSEUR",this.ouvrage.fournisseur)
      })
    } )
  }

  getOuvragePriceById(id:number):void{
    // this.ouvrageCoutService.getSumOuvrageById(id).subscribe(data =>{
    //   this.prixOuvrage = data.sommeCouts
    // })
  }


  deleteById(Coutid:any):void{
    console.log(Coutid)
    this.ouvrageCoutService.deleteByID(Coutid,this.ouvrageID).subscribe(() => {
      //this.deleteCout.emit()
      this.getById()
      alert("Cout supprimer de l'ouvrage")
    })
  }

  uRatio(ouvrage:Ouvrage, cout:Cout): string{
    return `${cout.unite}/${ouvrage.unite}`
  }

  ratioChange(event:any, cout:Cout, ouvrage:Ouvrage){
    console.log("console from detail ouvrage event = ",event)
    // const uRatio = `${cout.unite}/${ouvrage.unite}`
    this.ouvrageCout = {
      OuvrageId: this.ouvrageID,
      CoutId: cout.id,
      ratio: event,
      uRatio: this.uRatio(ouvrage, cout)
    }
    this.ouvrageCoutService.updateOuvrageCout(cout.id,this.ouvrageID,this.ouvrageCout).subscribe()
  }

}
