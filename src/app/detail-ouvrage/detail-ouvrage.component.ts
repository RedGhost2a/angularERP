import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Ouvrage} from "../_models/ouvrage";
import {Cout} from "../_models/cout";
import {ActivatedRoute} from "@angular/router";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-detail-ouvrage',
  templateUrl: './detail-ouvrage.component.html',
  styleUrls: ['./detail-ouvrage.component.scss']
})
export class DetailOuvrageComponent implements OnInit {
  @Input() ouvrage!:Ouvrage
  prixOuvrage!:number
  ouvrageID!:number
  cout!:Cout[]
  @Output() deleteCout: EventEmitter<any> = new EventEmitter()

  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              private ouvrageCoutService: OuvrageCoutService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getById(this.ouvrageID)
    } )
    this.getById()
    //this.getSum()
    console.log(this.ouvrage)
  }

  getSum():void{
    this.ouvrageService.getSum(this.ouvrageID).subscribe(data =>{
      console.log(data['totalPrix']);
      this.prixOuvrage = data.totalPrix;
      console.log('prix unitaire ouvrage: ' + this.prixOuvrage)
    })
  }

  getById():void{
    this.ouvrageService.getById(this.ouvrageID).subscribe(data =>{ this.ouvrage = data;
      this.cout = data.Couts
    });
  }
  deleteById(Coutid:any):void{
    console.log(Coutid)
    this.ouvrageCoutService.deleteByID(Coutid,this.ouvrageID).subscribe(() => {
      this.deleteCout.emit()
      alert("Cout supprimer de l'ouvrage")
    })
  }

}