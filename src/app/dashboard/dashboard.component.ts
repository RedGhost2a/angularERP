import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import {DevisService} from "../_service/devis.service";
import {Devis} from "../_models/devis";
import {EntrepriseService} from "../_service/entreprise.service";
import {UserService} from "../_service/user.service";
import {User} from "../_models/users";

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
  user!:User;
  currentEntrepriseIndex: number = 0;
  denomination: string = '';





  constructor(private devisService :DevisService,private entrepriseService:EntrepriseService,private userService:UserService){
    this.user = this.userService.userValue;
  }

  ngOnInit(): void {
    console.log("ngOninit")
    if (this.user.role === 'Super Admin') {
    console.log("ngOninit super admin")
      this.getPrixVenteHT();
    }else if (this.user.role === 'Admin'){
    console.log("ngOninit admin")
      this.getIdEntreprise();
    }

  }


  getIdEntreprise() {
    console.log("getIdEntreprise")
    this.userService.getById(this.user.id).subscribe(data => {
      this.entrepriseId = data.Entreprises.map((item: { id: any; }) => item.id);
      const id = this.entrepriseId[this.currentEntrepriseIndex];

      this.getPrixVenteHTForAdmin();
        })
  }

// Ajoutez les fonctions pour les boutons suivant et précédent
  prevEntreprise() {
    if (this.currentEntrepriseIndex > 0) {
      this.currentEntrepriseIndex--;
      this.getPrixVenteHTForAdmin();
    }
  }

  nextEntreprise() {
    if (this.currentEntrepriseIndex < this.entrepriseId.length - 1) {
      this.currentEntrepriseIndex++;
      this.getPrixVenteHTForAdmin();
    }
  }

  getPrixVenteHT(){
    console.log("getPrixVenteHT")
      this.devisService.getAll().subscribe(data=>{
        this.devis = data;
        this.frais =data.map((item: { debourseSecTotal: any; }) => item.debourseSecTotal);
        this.nomDevis =data.map((item: { name: any; }) => item.name);
        this.prixVenteHT =data.map((item: { prixVenteHT: any; }) => item.prixVenteHT);
        this.moyenneBenefAleas =data.map((item: { moyenneBeneficeAleas: any; }) => item.moyenneBeneficeAleas);
        this.moyenneDeLaMoyenneBenefAleas = this.moyenneBenefAleas.reduce((a: any, b: any) => a + b, 0)/this.moyenneBenefAleas.length;
        this.prixVenteHTCalculer = this.prixVenteHT.reduce((a: any, b: any) => a + b, 0);
        this.fraisCalculer = this.frais.reduce((a: any, b: any) => a + b, 0);
        this.createChart();
      })
    }



  getPrixVenteHTForAdmin() {
    console.log("getPrixVenteHTForAdmin")

    const id = this.entrepriseId[this.currentEntrepriseIndex];
    this.devisService.getDevisByEnterprise(id).subscribe(data => {
      this.devis = data.Devis;
      this.denomination = data.denomination; // Affectation de la propriété denomination

      console.log("DATA : ", data)
      this.frais = data.Devis.map((item: { debourseSecTotal: any; }) => item.debourseSecTotal);
      console.log("DATA : ", this.frais)
      this.nomDevis = data.Devis.map((item: { name: any; }) => item.name);
      this.prixVenteHT = data.Devis.map((item: { prixVenteHT: any; }) => item.prixVenteHT);
      this.moyenneBenefAleas = data.Devis.map((item: { moyenneBeneficeAleas: any; }) => item.moyenneBeneficeAleas);
      this.moyenneDeLaMoyenneBenefAleas = this.moyenneBenefAleas.reduce((a: any, b: any) => a + b, 0) / this.moyenneBenefAleas.length;
      this.prixVenteHTCalculer = this.prixVenteHT.reduce((a: any, b: any) => a + b, 0);
      this.fraisCalculer = this.frais.reduce((a: any, b: any) => a + b, 0);
      this.createChart();
    })
  }



  createChart() {
    console.log("createChart")
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: this.nomDevis,
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
        aspectRatio: 3.9
      }
    });
  }}
