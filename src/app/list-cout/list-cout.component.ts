import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CoutService} from "../_service/cout.service";
import {Cout} from "../_models/cout";



@Component({
  selector: 'app-list-cout',
  templateUrl: './list-cout.component.html',
  styleUrls: ['./list-cout.component.scss']
})
export class ListCoutComponent implements OnInit {
  @Input() listCout!: Cout[]
  EntrepriseId = 1
  columnsToDisplay = ["type","categorie","designation", "unite", "prixUnitaire", "boutons"];


  constructor(private coutService:CoutService) { }


  ngOnInit(): void {
    this.getAll(this.EntrepriseId)

  }


  getAll(EntrepriseId:any):void{
    this.coutService.getAll(EntrepriseId).subscribe(data => {
      this.listCout = data;
      console.log(data)
    });
  }

  delete(id:number):void{
    // this.coutService.deleteByID(this.listCout.map(value => value.id)).subscribe(() => this.deleteCout.emit())

    this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
  }


}
