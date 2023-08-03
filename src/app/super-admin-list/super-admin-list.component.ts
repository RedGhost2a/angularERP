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
import {MatTableDataSource} from "@angular/material/table";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";

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
  dataSource !: MatTableDataSource<Client>
  displayedColumns: string[] = ['denomination', 'adresse', 'city','identity'];
  @Input() devis!: Devis;
  client!: Client[];

  constructor(
    private entrepriseService: EntrepriseService,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private devisService: DevisService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getParamId();
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.devisService.deleteByID(id).subscribe((() => this.ngOnInit()))
      }
    });
  }

  getById(id: number) {
    this.entrepriseService.getById(id).subscribe((data) => {
      this.entreprise = data;
      this.userAll = this.entreprise.Users;
      this.devisAll = this.entreprise.Devis;
      // console.log(this.entreprise);
       console.log(this.devisAll);
    });
  }
  openDialogCreateClient(client: Client | null, disable: boolean) {
    this.clientService.openDialogCreateClient(client, disable, () => {
      // this.getCurrentUser()
    })
  }
  getClientByEntreprise(id: number) {
    this.entrepriseService.getClientByEntreprise(id).subscribe(
      (data: any) => {
        const clients = data.Devis.map((devis: any) => devis.Client);

        // Supprimez les doublons de clients en fonction de leur ID
        const uniqueClients = clients.filter(
          (client: any, index: number, array: any[]) =>
            array.findIndex((c: any) => c.id === client.id) === index
        );

        console.log("Liste des clients :", uniqueClients);

        // Faites ce que vous voulez avec la liste des clients ici, par exemple, affectez-la à une variable du composant.
         this.client = uniqueClients;
        this.dataSource = new MatTableDataSource(this.client);

      },
      (error: any) => {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    );
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
