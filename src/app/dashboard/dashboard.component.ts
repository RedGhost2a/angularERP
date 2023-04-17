import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import {DevisService} from "../_service/devis.service";
import {Devis} from "../_models/devis";
import {EntrepriseService} from "../_service/entreprise.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public chart: any;
  public devis: Devis[] = [];
  public devisId: Devis[] = [];
  public prixVenteHT: number[] = [];
  public prixVenteHTCalculer!: number;
  public fraisCalculer!: number;
  public frais: number[] = [];
  public nomDevis: string[] = [];
  public moyenneBenefAleas: number[]=[];
  public moyenneDeLaMoyenneBenefAleas!: number;
  public denominationEntreprise: string[]=[];
  public entrepriseId: number[]=[];


  constructor(private devisService :DevisService,private entrepriseService:EntrepriseService){
  }

  ngOnInit(): void {
    this.getPrixVenteHT();
    this.getNumberOfEntreprise();
  }

  getNumberOfEntreprise(){
    this.entrepriseService.getAll().subscribe(data=>{
      this.denominationEntreprise=data.map((item: { denomination: any; }) => item.denomination);
      this.entrepriseId=data.map((item: { id: any; }) => item.id);
      this.denominationEntreprise.forEach((item: any, index: any) => {
        this.getDevisByEntreprise(this.entrepriseId[index]);
      });

    })
  }


  getDevisByEntreprise(id: any)  {
    this.devisService.getDevisByEnterprise(id).subscribe(data=>{
      this.devisId = data;
  })
  }


  getPrixVenteHT(){
     this.devisService.getAll().subscribe(data=>{
       this.devis = data;
       this.frais =data.map((item: { coutTotal: any; }) => item.coutTotal);
       this.nomDevis =data.map((item: { name: any; }) => item.name);
       this.prixVenteHT =data.map((item: { prixVenteHT: any; }) => item.prixVenteHT);
       this.moyenneBenefAleas =data.map((item: { moyenneBeneficeAleas: any; }) => item.moyenneBeneficeAleas);
       this.moyenneDeLaMoyenneBenefAleas = this.moyenneBenefAleas.reduce((a: any, b: any) => a + b, 0)/this.moyenneBenefAleas.length;
       this.prixVenteHTCalculer = this.prixVenteHT.reduce((a: any, b: any) => a + b, 0);
       this.fraisCalculer = this.frais.reduce((a: any, b: any) => a + b, 0);
       this.createChart();

     })

  }


  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels:  this.nomDevis,
        datasets: [
          {
            label: "Prix de vente HT",
            data: this.prixVenteHT,
            backgroundColor: 'blue'
          },
          {
            label: "Total Frais",
            data: this.frais,
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:3.9
      }

    });
  }
}
