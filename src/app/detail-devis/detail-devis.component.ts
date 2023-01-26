import {Component, Inject, OnInit} from '@angular/core';
import {Devis} from "../_models/devis";
import {DevisService} from "../_service/devis.service";
import {ActivatedRoute} from "@angular/router";
import {Client} from "../_models/client";
import {User} from "../_models/users";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LotService} from "../_service/lot.service";
import {Lot} from "../_models/lot";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";

@Component({
  selector: 'app-detail-devis',
  templateUrl: './detail-devis.component.html',
  styleUrls: ['./detail-devis.component.scss']
})
export class DetailDevisComponent implements OnInit {
  devis!: Devis;
  client!: Client;
  devisID!: number;
  user!: User;
  lot = new Lot ;
  // lot = { designation: "Frais de chantier", devisId: 0 };

  constructor(private devisService: DevisService, private route: ActivatedRoute,
              private lotService : LotService,@Inject(TOASTR_TOKEN) private toastr: Toastr) {

  }

  ngOnInit(): void {
    console.log("bonne page ?")
    this.getById();
  }

  getById(): void {
    this.route.params.subscribe(params => {
      console.log(params)
      this.devisID = +params['id'];
      this.devisService.getById(this.devisID).subscribe(data => {
        console.log(data)
        const {Client, Users} = data;
        this.devis = data;
        this.client = Client;
        this.user = Users[0];
      })
    })
  }
  createLOT(devisId:number): void {
    console.log("ENFJKDSLQ",devisId)
      this.lot.devisId = devisId;
      this.lot.designation = `Frais de chantier ${this.lot.devisId}`
      // this.lot.designation = "fdsfqds"
      console.log("console lot detail devis",this.lot)
      this.lotService.create(this.lot)
        .subscribe((response: any) => {

          // this.lotsDevis = response.lot.lot
          // this.lots.push(this.lotsDevis); // ajouts dans le tableaux
          // // console.log(this.lotsDevis)
          // const lotId = response.lot.lotId;
          // console.log(lotId)
// Récupérer l'ID du lot créé et le stocker dans le service de partage de données
//           this.dataSharingService.setLotId(lotId);
          this.success("Nouveau lot en vue !")
          //this.refreshData()
         // this.changeDetectorRef.detectChanges(); // Déclencher la détection de changements manuellement//pas sur a voir

// this.router.navigate(['/devis']);
        }, error => {
          console.log(error)
          this.warning("Une erreur est survenue lors de la création")
        });
  }

  success(message: string): void {
    this.toastr.success(message, "Succès");
  }
  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }


}
