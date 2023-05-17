import {Component, Inject, OnInit} from '@angular/core';
import {Devis} from "../_models/devis";
import {DevisService} from "../_service/devis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Client} from "../_models/client";
import {User} from "../_models/users";
import {LotService} from "../_service/lot.service";
import {Lot} from "../_models/lot";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {addDays, differenceInDays, format} from 'date-fns';
import {FormBuilder, FormGroup} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";

@Component({
  selector: 'app-detail-devis',
  templateUrl: './detail-devis.component.html',
  styleUrls: ['./detail-devis.component.scss']
})
export class DetailDevisComponent implements OnInit {
  devis!: Devis;
  client!: Client;
  devisID!: number
  user!: User;
  lot = new Lot;
  jourRestant!: number;
  jourFinDevis!: string;
  statusForm!: FormGroup;
  detailStatus: string[] = ['Initialisation', 'En attente', 'Accepté', 'Refusé', "Cloturer", 'Je ne sais pas'];
  selectedStatus!: string;
  validityTime!: number;
  isEditMode: boolean = false;
  isEditMode2: boolean = false;
  isEditMode3: boolean = false;
  isEditMode4: boolean = false;
  beneficeInPercent!: number;
  aleasInPercent!: number;


  constructor(private devisService: DevisService,
              private route: ActivatedRoute,
              private router: Router,
              private lotService: LotService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private formBuilder: FormBuilder,
              private ouvrageService: OuvrageService) {


  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.devisID = +params['id'];
      this.getById();
    })

  }


  updateStatusDevis() {
    this.devisService.update({status: this.selectedStatus}, this.devisID).subscribe(() => {
      this.toastr.success('Succes', 'Le statut a été mis à jour.');
      this.getById();
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour du statut.');
      console.error(error);
    });
  }

  updateBenefDevis() {
    this.devisService.update({beneficeInPercent: this.beneficeInPercent}, this.devisID).subscribe(() => {
      this.toastr.success('Succes', 'Le statut a été mis à jour.');
      this.getById();
      this.updateBenefAndAleasDevis()

    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour du statut.');
      console.error(error);
    });
  }

  updateAleasDevis() {
    this.devisService.update({aleasInPercent: this.aleasInPercent}, this.devisID).subscribe(() => {
      this.toastr.success('Succes', 'Le statut a été mis à jour.');
      this.updateBenefAndAleasDevis()
      this.getById();
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour du statut.');
      console.error(error);
    });
  }

  updateBenefAndAleasDevis() {
    console.log("startd")
    // récupérer le devis en cours de modification
    this.devisService.getOuvrages(this.devisID).subscribe(devis => {
      const ouvrages = devis[0];
      console.log(devis)
      // stocker les ids des ouvrages dont alteredBenefOrAleas est false

      const ouvragesIds: number[] = [];
      ouvrages.forEach((ouvrage: any) => {
        if (!ouvrage.alteredBenefOrAleas) {
          ouvragesIds.push(ouvrage.id);
        }
      });
      console.log(ouvragesIds)
      // mettre à jour les ouvrages avec les nouvelles valeurs pour les ouvrages dont alteredBenefOrAleas est true
      const updatedOuvrage = {
        benefice: this.beneficeInPercent,
        aleas: this.aleasInPercent
      };
      for (let i = 0; i < ouvragesIds.length; i++) {
        console.log("loop")
        this.ouvrageService.updateOuvrageDuDevis(updatedOuvrage, [ouvragesIds[i]]).subscribe(() => {
          this.toastr.success('Succes', 'Les champs benefice et aleas ont été mis à jour.');
          this.getById();
        }, error => {
          this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour des champs benefice et aleas.');
          console.error(error);
        });
      }

    });
  }


  updateValidityDevis() {
    this.devisService.update({validityTime: this.validityTime}, this.devisID).subscribe(() => {
      this.toastr.success('Succes', 'La durée a été mis à jour.');
      this.getById();
    }, error => {
      this.toastr.error('Error', 'Une erreur est survenue lors de la mise à jour de la durée.');
      console.error(error);
    });
  }


  getById(): void {
    this.devisService.getById(this.devisID).subscribe(data => {
      const {Client, Users} = data;
      this.devis = data;
      this.selectedStatus = this.devis.status;
      this.client = Client;
      this.validityTime = this.devis.validityTime;
      this.user = Users[0];
      // La date du jour
      const today = new Date();
      if (this.devis && this.devis.createdAt) {
        const createdAt = new Date(this.devis.createdAt);
        const endDate = addDays(createdAt, this.validityTime);
        this.jourRestant = differenceInDays(endDate, today);
        this.jourFinDevis = format(endDate, 'dd/MM/yyyy');
      } else {
        console.log('La date de création du devis est manquante');
      }
    })
  }

  createLOT(devisId: number): void {
    this.devis.coeffEquilibre = 1;
    localStorage.setItem("coef", this.devis.coeffEquilibre.toString())
    this.lot.devisId = devisId;
    this.lot.designation = `Frais de chantier du devis n°: ${this.lot.devisId}`
    console.log("console lot detail devis", this.lot)
    this.lotService.createLotFraisDeChantier(this.lot)
      .subscribe((response: any) => {
        this.toastr.success('Succes', "Nouveau lot en vue !")
        this.router.navigate([`/devisCreate/${devisId}`]);
      }, error => {
        console.log(error)
        this.toastr.warning('Attention', "Une erreur est survenue lors de la création")
      });
  }

  // success(message: string): void {
  //   this.toastr.success(message, "Succès");
  // }
  //
  // warning(message: string): void {
  //   this.toastr.warning(message, "Attention");
  // }


}
