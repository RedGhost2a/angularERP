import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CoutService} from "../_service/cout.service";
import {Cout} from "../_models/cout";
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-list-cout',
  templateUrl: './list-cout.component.html',
  styleUrls: ['./list-cout.component.scss']
})
export class ListCoutComponent implements OnInit {
  @Input() listCout!: Cout[]
  columnsToDisplay = ["type","categorie","designation", "unite", "prixUnitaire", "boutons"];

  constructor(private coutService:CoutService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllCouts()

  }

  getAllCouts():void{
    if(this.route.routeConfig?.path === 'listCout'){
        this.coutService.getAllCouts().subscribe(data => this.listCout = data);
    }else this.coutService.getAllFraisDeChantier().subscribe( data => this.listCout = data)
  }


  delete(id:number):void{
    this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
  }


}
