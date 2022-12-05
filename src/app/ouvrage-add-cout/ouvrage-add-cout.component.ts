import {Component, Injector, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Cout} from "../_models/cout";
import {CoutService} from "../_service/cout.service";
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";


@Component({
  selector: 'app-ouvrage-add-cout',
  templateUrl: './ouvrage-add-cout.component.html',
  styleUrls: ['./ouvrage-add-cout.component.scss']
})
export class OuvrageAddCoutComponent implements OnInit {
  listCout!:Cout[];
  coutChecked :number[] = [];
  ouvrageId!:number;
  isCout!:boolean;
  isFraisDeChantier!:boolean;
  redirectButton!:string;

  columnsToDisplay = ["checkBox","type","categorie","designation", "unite", "prixUnitaire", "fournisseur"];

  constructor(private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageService: OuvrageService, private ouvrageCoutService : OuvrageCoutService) { }




  ngOnInit(): void {
    this.route.params.subscribe(params=>this.ouvrageId = +params['id'])
    this.ouvrageService.getById(this.ouvrageId).subscribe(data =>{
      this.isCout = data.isCout;
      this.isFraisDeChantier = data.isFraisDeChantier;
      this.getAll()
    })

  }


  getAll(): void{
    if(this.isCout && this.isFraisDeChantier){
      this.coutService.getAll().subscribe(data => this.listCout = data)
      this.redirectButton = "/listOuvrageCout";
    }if(this.isCout){
      this.coutService.getAllCouts().subscribe(data => this.listCout = data)
      this.redirectButton = "/listOuvrageCout"
    }else{
    this.coutService.getAllFraisDeChantier().subscribe(data => this.listCout = data)
      this.redirectButton = "/listOuvrageFrais"
      console.log(this.redirectButton)
    }
  }

  addCoutOuvrage():void {
    for (let val of this.coutChecked) {
      this.ouvrageCoutService.addCoutOuvrage(val, this.ouvrageId).subscribe()
    }
  }


  onCheck(idCout: number):void {
    if(this.coutChecked.indexOf(idCout) !== -1){
      this.coutChecked.forEach((element,index)=>{
        if(element === idCout) this.coutChecked.splice(index,1);
      });
    }else this.coutChecked.push(idCout)
  }



}
