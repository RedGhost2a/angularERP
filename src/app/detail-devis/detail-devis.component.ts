import {Component, Inject, OnInit} from '@angular/core';
import {Devis} from "../_models/devis";
import {DevisService} from "../_service/devis.service";
import {ActivatedRoute} from "@angular/router";
import {Client} from "../_models/client";
import {User} from "../_models/users";
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

  constructor(private devisService: DevisService, private route: ActivatedRoute,
              private lotService : LotService,@Inject(TOASTR_TOKEN) private toastr: Toastr) {

  }

  ngOnInit(): void {
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
      console.log("console lot detail devis",this.lot)
      this.lotService.create(this.lot)
        .subscribe((response: any) => {
          this.success("Nouveau lot en vue !")
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
