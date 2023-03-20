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


  constructor(private devisService: DevisService,
              private route: ActivatedRoute,
              private router: Router,
              private lotService: LotService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private formBuilder: FormBuilder) {


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


  getById(): void {
    this.devisService.getById(this.devisID).subscribe(data => {
      const {Client, Users} = data;
      this.devis = data;
      this.selectedStatus = this.devis.status;
      this.client = Client;
      this.user = Users[0];
      // La date du jour
      const today = new Date();
      if (this.devis && this.devis.createdAt) {
        const createdAt = new Date(this.devis.createdAt);
        const endDate = addDays(createdAt, 90);
        this.jourRestant = differenceInDays(endDate, today);
        this.jourFinDevis = format(endDate, 'dd/MM/yyyy');
      } else {
        console.log('La date de création du devis est manquante');
      }
    })
  }

  createLOT(devisId: number): void {
    this.lot.devisId = devisId;
    this.lot.designation = `Frais de chantier ${this.lot.devisId}`
    console.log("console lot detail devis", this.lot)
    this.lotService.create(this.lot)
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
