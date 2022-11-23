import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";
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

  constructor(private ouvrageService: OuvrageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.ouvrageID = +params['id'];
      this.ouvrageService.getById(this.ouvrageID)
    } )
    this.getById()
    this.getSum()
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
    });
  }

}
