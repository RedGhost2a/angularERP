import {Component, Input, OnInit} from '@angular/core';
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


  @Input() listCout!:Cout[]
  coutOuvrage!:Cout;
  coutChecked :number[] = [];
  ouvrageId!:number
  columnsToDisplay = ["checkBox","type","categorie","designation", "unite", "prixUnitaire", "fournisseur","remarque"];


  constructor(private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageService: OuvrageService, private ouvrageCoutService : OuvrageCoutService) { }




  ngOnInit(): void {
    this.getAll()
    this.route.params.subscribe(params=>this.ouvrageId = +params['id'])
  }
  getAll(): void{
    this.coutService.getAll(1).subscribe(data =>{
      this.listCout = data
      console.log("dATA",data)
    })
  }



  addCoutOuvrage() {
    for (let val of this.coutChecked) {
      console.log(val);
      console.log('valeur')
      //this.ouvrageCoutService.addCoutOuvrage(val, this.ouvrageId).subscribe()
      console.log('OUVRAGE AJOUT COUT')
      this.coutService.getById(val).subscribe(data=>{
        this.coutOuvrage = data;
        console.log(data)
        console.log(typeof(data.Fournisseurs));
      this.coutService.createCoutDuDevis(data).subscribe()
      })
    }
  }




  onCheck(idCout: number):void {
    if(this.coutChecked.indexOf(idCout) !== -1){
      this.coutChecked.forEach((element,index)=>{
        if(element== idCout) this.coutChecked.splice(index,1);
      });
    }else{
      this.coutChecked.push(idCout)
    }
    console.log(this.coutChecked);
  }



}
