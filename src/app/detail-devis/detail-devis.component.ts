import {Component, OnInit} from '@angular/core';
import {Devis} from "../_models/devis";
import {DevisService} from "../_service/devis.service";
import {ActivatedRoute} from "@angular/router";
import {Client} from "../_models/client";
import {User} from "../_models/users";

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


  constructor(private devisService: DevisService, private route: ActivatedRoute) {
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


}
