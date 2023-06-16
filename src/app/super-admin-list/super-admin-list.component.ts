import {Component, Input, OnInit} from "@angular/core";
import {EntrepriseService} from "../_service/entreprise.service";
import {ActivatedRoute} from "@angular/router";
import {Client} from "../_models/client";
import {Devis} from "../_models/devis";
import {DevisService} from "../_service/devis.service";
import {ClientService} from "../_service/client.service";
import {UniquePipe} from "../_helpers/FiltreUnique";
import {User} from "../_models/users";
import {da} from "date-fns/locale";

@Component({
  selector: "app-super-admin-list",
  templateUrl: "./super-admin-list.component.html",
  styleUrls: ["./super-admin-list.component.scss"],
  providers: [UniquePipe],
})
export class SuperAdminListComponent implements OnInit {
  entreprise!: any;
  userAll!: User[];
  devisAll!: Devis[];
  displayedColumns: string[] = [
    "Devis n°",
    "Nom",
    "Client",
    "Status",
    "Action",
  ];
  clickedRows = new Set<Client>();
  @Input() devis!: Devis;
  client!: Client[];

  constructor(
    private entrepriseService: EntrepriseService,
    private route: ActivatedRoute,
    private devisService: DevisService,
    private clientService: ClientService
  ) {
  }

  ngOnInit(): void {
    this.getParamId();
  }

  delete(id: any): void {
    this.devisService.deleteByID(id).subscribe(() => this.ngOnInit());
  }

  getById(id: number) {
    this.entrepriseService.getById(id).subscribe((data) => {
      this.entreprise = data;
      this.userAll = this.entreprise.Users;
      this.devisAll = this.entreprise.Devis;
      // console.log(this.entreprise);
      // console.log(this.devisAll);
    });
  }

  getClientByEntreprise(id: number) {
    this.entrepriseService.getClientByEntreprise(id).subscribe((data) => {
      this.client = data.Devis;
      console.log("data client", data)
      this.client = this.client.filter(
        (item: any, index: any, array: string | any[]) =>
          array.indexOf(item) === index
      );

      console.log(this.client);
      return this.client;
    });
  }

  // getByCompany(id: number) {
  //   this.clientService.getByCompany(id).subscribe(value => {
  //     this.client = value
  //     console.log(this.client);
  //     return this.client;
  //   })
  // }

  getParamId() {
    this.route.params.subscribe((data) => {
      console.log(data);
      const id = +data["id"];
      this.getById(id);
      this.getClientByEntreprise(id);
      // console.log(this.client);
    });
  }
}
