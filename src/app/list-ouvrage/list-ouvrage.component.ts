import {Component, Input, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-list-ouvrage',
  templateUrl: './list-ouvrage.component.html',
  styleUrls: ['./list-ouvrage.component.scss']
})
export class ListOuvrageComponent implements OnInit {
  @Input() listOuvrage!: Ouvrage[];

  columnsToDisplay = ["designation","benefice","aleas", "unite","ratio", "uRatio","prixUnitaire", "boutons"];

  constructor(private ouvrageService: OuvrageService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.getAll()
  }
  getAll():void{
    if(this.route.routeConfig?.path==='listOuvrageCout'){
    this.ouvrageService.getAllCouts().subscribe(data =>this.listOuvrage = data)
    }else this.ouvrageService.getAllFraisDeChantier().subscribe(data =>this.listOuvrage = data)
  }
  delete(id: number): void{
    this.ouvrageService.deleteByID(id).subscribe(() => this.ngOnInit())
  }


}
