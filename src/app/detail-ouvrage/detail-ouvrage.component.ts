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
  ouvrage!:Ouvrage
  prixOuvrage!:number
  ouvrageID!:number
  cout!:Cout[]

  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute,
              private ouvrageCoutService: OuvrageCoutService) { }

  ngOnInit(): void {
    this.getOuvrageById()
  }


  getOuvrageById():void{
    console.log(this.route)
    this.route.params.subscribe(params => {
      this.ouvrageID = +params['id'];
      this.ouvrageService.getById(+params['id']).subscribe(data => {
        this.ouvrage = data;
        this.cout = data.Couts;
      })
    })
  }


  getSum():void{
    this.ouvrageService.getSum(this.ouvrageID).subscribe(data =>{
      console.log(data['totalPrix']);
      this.prixOuvrage = data.totalPrix;
      console.log('prix unitaire ouvrage: ' + this.prixOuvrage)
    })
  }

  // getById():void{
  //   this.ouvrageService.getById(this.ouvrageID).subscribe(data =>{ this.ouvrage = data;
  //     this.cout = data.Couts
  //     console.log(data);
  //     console.log(data.id);
  //   });
  // }

  deleteById(Coutid:any):void{
    console.log(Coutid)
    this.ouvrageCoutService.deleteByID(Coutid,this.ouvrageID).subscribe(() => {
      this.ngOnInit()
    })
  }

}
