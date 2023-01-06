import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Cout} from "../_models/cout";
import {CoutService} from "../_service/cout.service";
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {CoutDuDevis} from "../_models/cout-du-devis";


@Component({
  selector: 'app-ouvrage-add-cout',
  templateUrl: './ouvrage-add-cout.component.html',
  styleUrls: ['./ouvrage-add-cout.component.scss']
})
export class OuvrageAddCoutComponent implements OnInit {


  @Input() listCout!: Cout[]
  coutOuvrage!: Cout;
  coutChecked: number[] = [];
  ouvrageId!: number
  columnsToDisplay = ["checkBox", "type", "categorie", "designation", "unite", "prixUnitaire", "fournisseur", "remarque"];
  coutDuDevis!: CoutDuDevis;

  constructor(private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageService: OuvrageService, private ouvrageCoutService: OuvrageCoutService) {
  }


  ngOnInit(): void {
    this.getAll()
    this.route.params.subscribe(params => this.ouvrageId = +params['id'])
  }

  getAll(): void {
    this.coutService.getAll(2).subscribe(data => {
      this.listCout = data
      console.log("dATA", data)
    })
  }


  addCoutOuvrage() {
    for (let val of this.coutChecked) {
      // console.log(val);
      // console.log('valeur')
      //this.ouvrageCoutService.addCoutOuvrage(val, this.ouvrageId).subscribe()
      console.log('OUVRAGE AJOUT COUT')
      this.coutService.getById(val).subscribe(data => {
        this.coutOuvrage = data;
        console.log("data", data)
        //console.log(typeof(data.Fournisseurs));

        const {Fournisseurs}: any = data;
        const {TypeCout}: any = data;
        if (Fournisseurs[0].remarque === null) {
          Fournisseurs[0].remarque = "";
        }
        this.coutDuDevis = {
          OuvrageId: this.ouvrageId,
          type: TypeCout.type,
          categorie: TypeCout.categorie,
          designation: data.designation,
          unite: data.unite,
          prixUnitaire: data.prixUnitaire,
          fournisseur: Fournisseurs[0].commercialName,
          remarque: Fournisseurs[0].remarque
        }
        this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe()
      })
    }
  }


  onCheck(idCout: number): void {
    if (this.coutChecked.indexOf(idCout) !== -1) {
      this.coutChecked.forEach((element, index) => {
        if (element == idCout) this.coutChecked.splice(index, 1);
      });
    } else {
      this.coutChecked.push(idCout)
    }
    console.log(this.coutChecked);
  }


}
