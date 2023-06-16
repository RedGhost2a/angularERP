import {Component, Inject, OnInit} from '@angular/core';
import {Devis} from "../_models/devis";
import {DevisService} from "../_service/devis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LotService} from "../_service/lot.service";
import {Lot} from "../_models/lot";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {addDays, differenceInDays, format} from 'date-fns';
import {FormBuilder} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";

@Component({
  selector: 'app-detail-devis',
  templateUrl: './detail-devis.component.html',
  styleUrls: ['./detail-devis.component.scss']
})
export class DetailDevisComponent implements OnInit {
  devis!: Devis;
  lot = new Lot;
  jourRestant!: number;
  jourFinDevis!: string;
  detailStatus: string[] = ['Initialisation', 'En attente', 'Accepté', 'Refusé', "Cloturer", 'Je ne sais pas'];
  selectedStatus!: string;
  isEditMode: boolean = false;
  isEditMode2: boolean = false;
  isEditMode3: boolean = false;
  isEditMode4: boolean = false;

  constructor(private devisService: DevisService, private route: ActivatedRoute,private router: Router,
              private lotService: LotService,@Inject(TOASTR_TOKEN) private toastr: Toastr,
              private formBuilder: FormBuilder,private ouvrageService: OuvrageService) {


  }

  ngOnInit(): void {
   this.getRouteParams()

  }
  getRouteParams(){
    this.route.params.subscribe(params => {
      this.getById(+params['id']);
    })
  }


  updateStatusDevis() {
    this.devisService.update({status: this.selectedStatus}, this.devisService.currentDevis.id).subscribe(() => {
      this.toastr.success('Succes', 'Le statut a été mis à jour.');
      this.getById(this.devisService.currentDevis.id);
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour du statut.');
      console.error(error);
    });
  }

  updateBenefDevis() {
    this.devisService.update({beneficeInPercent: this.devis.beneficeInPercent}, this.devisService.currentDevis.id).subscribe(() => {
      this.toastr.success('Succes', 'Le statut a été mis à jour.');
      this.getById(this.devisService.currentDevis.id);
      this.updateBenefAndAleasDevis()
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour du statut.');
    });
  }

  updateAleasDevis() {
    this.devisService.update({aleasInPercent: this.devis.aleasInPercent}, this.devisService.currentDevis.id).subscribe(() => {
      this.toastr.success('Succes', 'Le statut a été mis à jour.');
      this.updateBenefAndAleasDevis()
      this.getById(this.devisService.currentDevis.id);
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour du statut.');
    });
  }

  updateBenefAndAleasDevis() {
    this.devisService.getOuvrages(this.devisService.currentDevis.id).subscribe(devis => {
      let ouvrages = devis[1];
      ouvrages = ouvrages.concat(devis[0])
      const updatedOuvrage = {
        benefice: this.devis.beneficeInPercent,
        aleas: this.devis.aleasInPercent
      };
      ouvrages.forEach((ouvrage: Ouvrage) =>{
        if(!ouvrage.alteredBenefOrAleas){
          this.ouvrageService.updateOuvrageDuDevis(updatedOuvrage, ouvrage.id).subscribe(() => {
            this.toastr.success('Succes', 'Les champs benefice et aleas ont été mis à jour.');
            this.getById(this.devisService.currentDevis.id);
          }, error => {
            this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour des champs benefice et aleas.');
            console.error(error);
          });
        }
      })
    });
  }


  updateValidityDevis() {
    this.devisService.update({validityTime: this.devis.validityTime}, this.devisService.currentDevis.id).subscribe(() => {
      this.toastr.success('Succes', 'La durée a été mis à jour.');
      this.getById(this.devisService.currentDevis.id);
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour de la durée.');
      console.error(error);
    });
  }

  getById(id:number): void {
    this.devisService.getByIdForDetail(id).subscribe((devis: Devis) => {
      console.log("devis get by id",devis)
      this.devis = devis;
      this.devisService.currentDevis = devis;
      this.validityDevis(devis)
    })
  }

  validityDevis(devis: Devis){
    const today = new Date();
    if (devis && devis.createdAt) {
      const createdAt = new Date(devis.createdAt);
      const endDate = addDays(createdAt, this.devis.validityTime);
      this.jourRestant = differenceInDays(endDate, today);
      this.jourFinDevis = format(endDate, 'dd/MM/yyyy');
      console.log('jour fin devis ', this.jourFinDevis)
    }
  }

  createLOT(devisId: number): void {
    this.devis.coeffEquilibre = 1;
    localStorage.setItem("coef", this.devis.coeffEquilibre.toString())
    this.lot.devisId = devisId;
    this.lot.designation = `Frais de chantier du devis n°: ${this.lot.devisId}`
    this.lotService.createLotFraisDeChantier(this.lot)
      .subscribe((response: any) => {
        this.toastr.success('Succes', "Nouveau lot en vue !")
        this.router.navigate([`/devisCreate/${devisId}`]);
      }, error => {
        console.log(error)
        this.toastr.warning('Attention', "Une erreur est survenue lors de la création")
      });
  }

}
